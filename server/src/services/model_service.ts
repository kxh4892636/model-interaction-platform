import { Request, Response } from "express";
import { dataFoldURL } from "../config/global_data";
import path, { dirname, resolve } from "path";
import crypto from "crypto";
import { spawn } from "child_process";
import { copySelectFilesInFolder } from "../utils/tools/fs_extra";
import { query } from "../utils/ewe/importEWE";
import { CRUDdatabase, HandleReturn, FlowDiagram, ModifyDatabase } from "../utils/ewe/exportEWE";
import { datasetService } from "./dataset_service";
import { prisma } from "../utils/tools/prisma";
import { copyFile, lstat, readFile, rename } from "fs/promises";
import { execa } from "execa";
import ADODB from "node-adodb";

// 计算结果
const R_test2 = async (req: Request, res: Response) => {
  const ModelState = req.body.ModelState;
  const num = req.body.singleID;
  if (ModelState === "Start") {
    const Group = req.body.Group;
    const Diet = req.body.Diet;
    const Detritus = req.body.Detritus;
    const DiscardFate = req.body.DiscardFate;
    const Land = req.body.Land;
    const Discard = req.body.Discard;
    const Fleet = req.body.Fleet;
    // 全部封到exportEWE中去
    await CRUDdatabase(Group, Fleet, Diet, Detritus, DiscardFate, Land, Discard, num);
    const { stdout } = await execa(`Rscript ./src/utils/ewe/EcoPath.R '${num}'`, {
      windowsHide: true,
    });
    // stdout.stdout!.on('end',()=>{
    //   // after
    // })

    // [1] TRUE 长度为10 后面还跟着2个空格 10*n-1  5个最后为49  加上“[1] ” 从54开始
    // 如果图标那一块真的要使用图片进行传输的话，多了“pdf 2” 所以要从65开始
    let data = JSON.parse(stdout.toString().slice(54));
    // 得弄两次，第一次弄完还是字符串string类型
    data = JSON.parse(data);
    data.Basic = JSON.parse(data.Basic);
    data.InputFlag = JSON.parse(data.InputFlag);
    data.link = JSON.parse(data.link);
    data.prenode = JSON.parse(data.prenode);
    return {
      BasicEst: HandleReturn(data.Basic, data.InputFlag),
      Graph: FlowDiagram(data.prenode, data.link),
      status: data.status,
      statusname: data.statusname,
    };
  } else if (ModelState === "Modify") {
    const ModifyData = req.body.ModifyData;
    const Group = req.body.Group;
    const Fleet = req.body.Fleet;
    console.log("此次修改的数据为", ModifyData);
    await ModifyDatabase(ModifyData, num, Group, Fleet);
    const { stdout } = await execa(`Rscript ./src/utils/ewe/EcoPath.R '${num}'`, {
      windowsHide: true,
    });
    // [1] TRUE 长度为10 后面还跟着2个空格 10*n-1  5个最后为49  加上“[1] ” 从54开始
    // 如果图标那一块真的要使用图片进行传输的话，多了“pdf 2” 所以要从65开始
    let data = JSON.parse(stdout.toString().slice(54));
    // 得弄两次，第一次弄完还是字符串string类型
    data = JSON.parse(data);
    // console.log(data.statusname)
    data.Basic = JSON.parse(data.Basic);
    data.InputFlag = JSON.parse(data.InputFlag);
    data.link = JSON.parse(data.link);
    data.prenode = JSON.parse(data.prenode);
    // res.send(data)
    return {
      BasicEst: HandleReturn(data.Basic, data.InputFlag),
      Graph: FlowDiagram(data.prenode, data.link),
      status: data.status,
      statusname: data.statusname,
    };
  } else {
    return "请勿重复执行";
  }
};

// 从模型文件按中导入
const R_test3 = async (req: Request, res: Response) => {
  const info = await prisma.data.findUnique({ where: { id: req.body.id } });
  const connection = ADODB.open(
    `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${
      dataFoldURL + info!.path
    };Persist Security Info=False;`
  );
  const result = await query(connection);
  return result;
};

// 水动力模型计算接口
const runHydrodynamics = async (
  paramKeys: string[],
  projKey: string,
  title: string,
  projectID: string,
  res: Response
) => {
  const timeStamp = Date.now().toString();
  const result = await datasetService.addDataset(title, projectID);
  const datasetID = result.content;
  const uvID = crypto.randomUUID();
  const modelID = crypto.randomUUID();
  try {
    // create the record of dataset and model_info
    const datasetInfo = await prisma.dataset.findUnique({
      where: {
        id: datasetID,
      },
    });
    let pids: string[] = [];
    await prisma.model_info.create({
      data: {
        id: modelID,
        is_running: true,
        dataset: datasetID,
        pids: undefined,
        progress: [0, 1],
      },
    });
    res.status(200).json({ status: "success", content: [datasetID, modelID, [uvID]] });
    // define keys of param
    let keys: string[] = paramKeys;
    projKey && keys.push(projKey);
    // copy model data by key
    const [meshFileName, extent] = await copyModelData(
      datasetID,
      modelID,
      datasetInfo!.path,
      datasetInfo!.timeStamp,
      paramKeys
    );
    if (!meshFileName) {
      await stopModel(modelID);
      // NOTE
      throw new Error("mesh 参数文件不存在");
    } else;
    if (!extent) {
      await stopModel(modelID);
      throw new Error("未成功获取 mesh 的范围");
    }
    // create the record fo result
    const uvetPath = datasetInfo!.path + "/model/uvet.dat";
    await prisma.data.create({
      data: {
        path: uvetPath,
        id: uvID,
        style: "water",
        title: "uvet流场数据",
        type: "model",
        extent: extent!,
        dataset: datasetID,
        input: false,
        timeStamp: timeStamp,
      },
    });
    await prisma.dataset.update({
      where: { id: datasetID },
      data: {
        data: [...datasetInfo!.data, uvID],
      },
    });
    // get model param
    const paramContent = (await readFile(dataFoldURL + datasetInfo!.path + "/model/paramhk.in"))
      .toString()
      .split("\r\n");
    let num = Number(paramContent[11].split(/\s/)[0]) * 24;
    let currentCount = 0;
    // run model
    const modelPath = dataFoldURL + datasetInfo!.path + "/model/elcirc.exe";
    const outputModel = spawn(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
      shell: true,
      windowsHide: true,
    });
    pids.push(outputModel.pid!.toString());
    await prisma.model_info.update({
      where: { id: modelID },
      data: {
        progress: [currentCount, num * 5 + 3],
        pids: pids,
      },
    });
    outputModel.stderr.on("data", async () => {
      console.log("model failed");
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [currentCount, num * 5 + 3],
          pids: [],
        },
      });
      await stopModel(modelID);
    });
    outputModel.stdout.on("data", async (chunk) => {
      const content = chunk.toString();
      console.log(content);
      if (content.includes("nt,it")) {
        // update the progress of result
        currentCount = currentCount + 3;
        await prisma.model_info.updateMany({
          where: {
            id: modelID,
          },
          data: { progress: [currentCount, num * 5 + 3] },
        });
      }
    });
    // NOTE
    outputModel.on("exit", async (code) => {
      if (code) return;
      else;
      pids.shift();
      console.log("model finished");
      // uvet2txt
      const result = spawn(
        `conda activate gis && python ${
          path.resolve("./").split("\\").join("/") +
          "/src/utils/water/uvet2txt.py" +
          " " +
          `${dataFoldURL}${datasetInfo!.path}/model/uvet.dat` +
          " " +
          `${dataFoldURL}${datasetInfo!.path}/transform/water` +
          " " +
          `${dataFoldURL}${datasetInfo!.path}/transform/mesh/${(meshFileName as string).replace(
            "gr3",
            "csv"
          )}` +
          " " +
          num +
          " " +
          timeStamp
        }`,
        { shell: true, windowsHide: true }
      );
      pids.push(result.pid!.toString());
      result.stderr.on("data", async () => {
        console.log("model failed");
        await stopModel(modelID);
      });
      result.on("exit", async (code) => {
        if (code) return;
        else;
        pids.shift();
        currentCount += 1;
        await prisma.model_info.update({
          where: { id: modelID },
          data: {
            progress: [currentCount, num * 5 + 3],
            pids: pids,
          },
        });
        console.log("uvet2txt finished");
        // uvet2description
        const result = spawn(
          `conda activate gis && python ${
            path.resolve("./").split("\\").join("/") +
            "/src/utils/water/uvet2description.py" +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/transform/water/description_${timeStamp}.json` +
            " " +
            `${datasetInfo!.path}/transform/water/` +
            " " +
            timeStamp +
            " " +
            `${datasetInfo!.path}/transform/water/` +
            " " +
            (extent as number[]).join(",") +
            " " +
            `../mesh/${(meshFileName as string).replace("gr3", "shp")}` +
            " " +
            num
          }`,
          { shell: true, windowsHide: true }
        );
        pids.push(result.pid!.toString());
        result.stderr.on("data", async () => {
          console.log("model failed");
          await stopModel(modelID);
        });
        // NOTE
        result.on("exit", async (code) => {
          if (code) return;
          else;
          pids.shift();
          currentCount += 1;
          await prisma.model_info.update({
            where: { id: modelID },
            data: {
              progress: [currentCount, num * 5 + 3],
              pids: pids,
            },
          });
          console.log("uvet2description finished");
          // uvet process
          await prisma.data.update({
            where: {
              id: uvID,
            },
            data: {
              transformPath: [
                `${datasetInfo!.path}/transform/water`,
                num.toString(),
                timeStamp.toString(),
              ],
            },
          });
          const processPath =
            resolve("./").split("\\").join("/") + "/src/utils/process/process.exe";
          const descriptionPath =
            dataFoldURL + datasetInfo!.path + "/transform/water/description_" + timeStamp + ".json";
          const output = spawn(processPath + " " + descriptionPath, {
            shell: true,
            windowsHide: true,
          });
          pids.push(output.pid!.toString());
          result.stderr.on("data", async () => {
            console.log("model failed");
            await stopModel(modelID);
          });
          output.stdout?.on("data", async (chunk) => {
            const content = chunk.toString();
            console.log(content);
            if (content.includes("uvet")) {
              currentCount += 1;
              await prisma.model_info.update({
                where: { id: modelID },
                data: {
                  progress: [currentCount, num * 5 + 3],
                  pids: pids,
                },
              });
            } else;
          });
          output.on("exit", async (code) => {
            if (code) return;
            else;
            pids.shift();
            console.log("process finished");
            // rename
            const descriptionPath = `${dataFoldURL}${
              datasetInfo!.path
            }/transform/water/flow_field_description.json`;
            for (let index = 0; index < num; index++) {
              const uvPath = `${dataFoldURL}${datasetInfo!.path}/transform/water/uv_${index}.png`;
              const maskPath = `${dataFoldURL}${
                datasetInfo!.path
              }/transform/water/mask_${index}.png`;
              const validPath = `${dataFoldURL}${
                datasetInfo!.path
              }/transform/water/valid_${index}.png`;
              await rename(
                uvPath,
                uvPath.replace(`uv_${index}.png`, `uv_${timeStamp}_${index}.png`)
              );
              await rename(
                maskPath,
                maskPath.replace(`mask_${index}.png`, `mask_${timeStamp}_${index}.png`)
              );
              await rename(
                validPath,
                validPath.replace(`valid_${index}.png`, `valid_${timeStamp}_${index}.png`)
              );
            }
            await rename(
              descriptionPath,
              descriptionPath.replace(
                `flow_field_description.json`,
                `flow_field_description_${timeStamp}.json`
              )
            );
            currentCount = currentCount + 1;
            await prisma.model_info.update({
              where: { id: modelID },
              data: {
                progress: [currentCount, num * 5 + 3],
                pids: pids,
                is_running: false,
              },
            });
            console.log("all finished");
          });
        });
      });
    });
  } catch (error) {
    await stopModel(modelID);
    if (error instanceof Error) {
      console.log(error.message);
    } else;
  }
};

const runQuality = async (
  paramKeys: string[],
  projKey: string,
  title: string,
  projectID: string,
  res: Response
) => {
  const timeStamp = Date.now().toString();
  const result = await datasetService.addDataset(title, projectID);
  const datasetID = result.content;
  const modelID = crypto.randomUUID();
  try {
    // create the record of dataset and model_info
    const datasetInfo = await prisma.dataset.findUnique({
      where: {
        id: datasetID,
      },
    });
    let pids: string[] = [];
    await prisma.model_info.create({
      data: {
        id: modelID,
        is_running: true,
        dataset: datasetID,
        pids: undefined,
        progress: [0, 1],
      },
    });
    res.status(200).json({ status: "success", content: [datasetID, modelID, []] });
    // define keys of param
    let keys: string[] = paramKeys;
    projKey && keys.push(projKey);
    // copy model data by key
    const [meshFileName, extent] = await copyModelData(
      datasetID,
      modelID,
      datasetInfo!.path,
      datasetInfo!.timeStamp,
      paramKeys
    );
    if (!meshFileName) {
      await stopModel(modelID);
      throw new Error("mesh 参数文件不存在");
    } else;
    if (!extent) {
      await stopModel(modelID);
      throw new Error("未成功获取 mesh 的范围");
    }
    // get model param
    const datContent = await readFile(dataFoldURL + datasetInfo!.path + "/model/初始浓度.dat");
    const resultNum = datContent.toString().split("\r\n").length;
    const resultFolder = datasetInfo!.path + "/model";
    const paramContent = (
      await readFile(dataFoldURL + datasetInfo!.path + "/model/wuran-gongkuang.dat")
    )
      .toString()
      .split("\r\n");
    let num = Number(paramContent[9].split(/\s/)[0]) * 24;
    let currentCount = 0;
    // create the record fo result
    let resultIDs: string[] = [];
    for (let index = 0; index < resultNum; index++) {
      const id = crypto.randomUUID();
      await prisma.data.create({
        data: {
          path: resultFolder + `/tnd${index + 1}.dat`,
          id: id,
          style: "quality",
          title: `tnd${index}`,
          type: "model",
          extent: extent!,
          dataset: datasetID,
          input: false,
          timeStamp: timeStamp,
        },
      });
      resultIDs.push(id);
    }

    await prisma.dataset.update({
      where: { id: datasetID },
      data: {
        data: resultIDs,
      },
    });
    // run quality model
    const modelPath = dataFoldURL + datasetInfo!.path + "/model/quality.exe";
    const outputModel = spawn(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
      shell: true,
      windowsHide: true,
    });
    pids.push(outputModel.pid!.toString());
    await prisma.model_info.update({
      where: { id: modelID },
      data: {
        progress: [currentCount, num * 5 + 3 * num * resultNum + 1],
        pids: pids,
      },
    });
    outputModel.stderr.on("data", async () => {
      console.log("model failed");
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [currentCount, num * 5 + 3 * num * resultNum + 1],
          pids: [],
        },
      });
      await stopModel(modelID);
    });
    outputModel.stdout.on("data", async (chunk) => {
      const content = chunk.toString();
      console.log(content);
      if (content.includes("time")) {
        // update the progress of result
        currentCount = currentCount + 5;
        await prisma.model_info.update({
          where: { id: modelID },
          data: {
            progress: [currentCount, num * 5 + 3 * num * resultNum + 1],
            pids: pids,
          },
        });
      }
    });
    outputModel.on("exit", async (code) => {
      if (code) return;
      else;
      pids.shift();
      console.log("model finished");
      // tnd2txt
      const tnd2txtPromise = async (index: number) => {
        return new Promise((resolve, reject) => {
          let stdout = "";
          let stderr = "";
          const cp = spawn(
            `conda activate gis && python ${
              path.resolve("./").split("\\").join("/") +
              "/src/utils/water/tnd2txt.py" +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/model/tnd${index + 1}.dat` +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/quality` +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/mesh/${(meshFileName as string).replace(
                "gr3",
                "csv"
              )}` +
              " " +
              num +
              " " +
              timeStamp
            }`,
            { shell: true, windowsHide: true }
          );
          cp.stdout.on("data", function (chunk) {
            stdout += chunk;
          });
          cp.stderr.on("data", function (chunk) {
            stderr += chunk;
          });
          cp.on("close", function (code) {
            if (code === 0) {
              resolve(stdout);
            } else {
              reject(stderr);
            }
          });
        });
      };
      let promises = [];
      for (let i = 0; i < resultNum; i++) {
        promises.push(
          tnd2txtPromise(i).then(async () => {
            currentCount = currentCount + 1;
            await prisma.model_info.update({
              where: { id: modelID },
              data: {
                progress: [currentCount, num * 5 + 3 * num * resultNum + 1],
                pids: pids,
              },
            });
            resolve("1");
          })
        );
      }
      await Promise.all(promises).catch(async () => {
        console.log("model failed");
        await stopModel(modelID);
      });
      console.log("tnd2txt finished");
      // tnd2png
      const tnd2pngPromise = async (i: number, j: number) => {
        return new Promise((resolve, reject) => {
          let stdout = "";
          let stderr = "";
          const cp = spawn(
            `conda activate gis && python ${
              path.resolve("./").split("\\").join("/") +
              "/src/utils/water/tnd2png.py" +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/quality/tnd${
                j + 1
              }_${timeStamp}_${i}.txt` +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/quality` +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/mesh/${(meshFileName as string).replace(
                "gr3",
                "shp"
              )}`
            }`,
            { shell: true, windowsHide: true }
          );
          cp.stdout.on("data", function (chunk) {
            stdout += chunk;
          });
          cp.stderr.on("data", function (chunk) {
            stderr += chunk;
          });
          cp.on("close", function (code) {
            if (code === 0) {
              resolve(stdout);
            } else {
              reject(stderr);
            }
          });
        });
      };
      // tnd2png
      for (let i = 0; i < num; i++) {
        for (let j = 0; j < resultNum; j++) {
          await tnd2pngPromise(i, j).catch(async () => {
            console.log("model failed");
            await stopModel(modelID);
          });
          currentCount = currentCount + 3;
          await prisma.model_info.update({
            where: { id: modelID },
            data: {
              progress: [currentCount, num * 5 + 3 * num * resultNum + 1],
              pids: pids,
            },
          });
        }
      }
      // update record
      await prisma.data.updateMany({
        where: {
          dataset: datasetID,
        },
        data: {
          transformPath: [
            `${datasetInfo!.path}/transform/quality`,
            num.toString(),
            timeStamp.toString(),
          ],
        },
      });
      currentCount = currentCount + 1;
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [currentCount, num * 5 + 3 * num * resultNum + 1],
          pids: pids,
          is_running: false,
        },
      });
      console.log("all finished");
    });
  } catch (error) {
    await stopModel(modelID);
    if (error instanceof Error) {
      console.log(error.message);
    } else;
  }
};

const runSand = async (
  paramKeys: string[],
  projKey: string,
  title: string,
  projectID: string,
  res: Response
) => {
  const timeStamp = Date.now().toString();
  const result = await datasetService.addDataset(title, projectID);
  const datasetID = result.content;
  const sndID = crypto.randomUUID();
  const yujiID = crypto.randomUUID();
  const modelID = crypto.randomUUID();
  try {
    // create the record of dataset and model_info
    const datasetInfo = await prisma.dataset.findUnique({
      where: {
        id: datasetID,
      },
    });
    let pids: string[] = [];
    await prisma.model_info.create({
      data: {
        id: modelID,
        is_running: true,
        dataset: datasetID,
        pids: undefined,
        progress: [0, 1],
      },
    });
    res.status(200).json({ status: "success", content: [datasetID, modelID, [sndID, yujiID]] });
    // define keys of param
    let keys: string[] = paramKeys;
    projKey && keys.push(projKey);
    // copy model data by key
    const [meshFileName, extent] = await copyModelData(
      datasetID,
      modelID,
      datasetInfo!.path,
      datasetInfo!.timeStamp,
      paramKeys
    );
    if (!meshFileName) {
      await stopModel(modelID);
      throw new Error("mesh 参数文件不存在");
    } else;
    if (!extent) {
      await stopModel(modelID);
      throw new Error("未成功获取 mesh 的范围");
    }
    // get model param
    const resultFolder = datasetInfo!.path + "/model";
    const paramContent = (
      await readFile(dataFoldURL + datasetInfo!.path + "/model/wuran-gongkuang.dat")
    )
      .toString()
      .split("\r\n");
    let num = Number(paramContent[9].split(/\s/)[0]) * 24;
    let currentCount = 0;
    // create the record fo result
    await prisma.data.create({
      data: {
        path: resultFolder + `/snd.dat`,
        id: sndID,
        style: "snd",
        title: `snd`,
        type: "model",
        extent: extent!,
        dataset: datasetID,
        input: false,
        timeStamp: timeStamp,
      },
    });
    await prisma.data.create({
      data: {
        path: resultFolder + `/yuji.dat`,
        id: yujiID,
        style: "yuji",
        title: `yuji`,
        type: "model",
        extent: extent!,
        dataset: datasetID,
        input: false,
        timeStamp: timeStamp,
      },
    });

    await prisma.dataset.update({
      where: { id: datasetID },
      data: {
        data: [sndID, yujiID],
      },
    });
    // run quality model
    const modelPath = dataFoldURL + datasetInfo!.path + "/model/sand.exe";
    const outputModel = spawn(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
      shell: true,
      windowsHide: true,
    });
    pids.push(outputModel.pid!.toString());
    await prisma.model_info.update({
      where: { id: modelID },
      data: {
        progress: [currentCount, num * 5 + 3],
        pids: pids,
      },
    });
    outputModel.stderr.on("data", async () => {
      console.log("model failed");
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [currentCount, num * 5 + 3],
          pids: [],
        },
      });
      await stopModel(modelID);
    });
    outputModel.stdout.on("data", async (chunk) => {
      const content = chunk.toString();
      console.log(content);
      if (content.includes("SED")) {
        // update the progress of result
        currentCount = currentCount + 3;
        await prisma.model_info.update({
          where: { id: modelID },
          data: {
            progress: [currentCount, num * 5 + 3],
            pids: pids,
          },
        });
      }
    });
    outputModel.on("exit", async (code) => {
      if (code) return;
      else;
      pids.shift();
      console.log("model finished");
      // tnd2txt
      const p1 = new Promise((resolve, reject) => {
        let stdout = "";
        let stderr = "";
        const cp = spawn(
          `conda activate gis && python ${
            path.resolve("./").split("\\").join("/") +
            "/src/utils/water/sand2txt.py" +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/model/snd.dat` +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/transform/sand` +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/transform/mesh/${(meshFileName as string)!.replace(
              "gr3",
              "csv"
            )}` +
            " " +
            num +
            " " +
            timeStamp
          }`,
          { shell: true, windowsHide: true }
        );
        cp.stdout.on("data", function (chunk) {
          stdout += chunk;
        });
        cp.stderr.on("data", function (chunk) {
          stderr += chunk;
        });
        cp.on("close", function (code) {
          if (code === 0) {
            resolve(stdout);
          } else {
            reject(stderr);
          }
        });
      });
      const p2 = new Promise((resolve, reject) => {
        let stdout = "";
        let stderr = "";
        const cp = spawn(
          `conda activate gis && python ${
            path.resolve("./").split("\\").join("/") +
            "/src/utils/water/sand2txt.py" +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/model/yuji.dat` +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/transform/sand` +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/transform/mesh/${(meshFileName as string)!.replace(
              "gr3",
              "csv"
            )}` +
            " " +
            num +
            " " +
            timeStamp
          }`,
          { shell: true, windowsHide: true }
        );
        cp.stdout.on("data", function (chunk) {
          stdout += chunk;
        });
        cp.stderr.on("data", function (chunk) {
          stderr += chunk;
        });
        cp.on("close", function (code) {
          if (code === 0) {
            resolve(stdout);
          } else {
            reject(stderr);
          }
        });
      });
      await Promise.all([p1, p2]).catch(async () => {
        console.log("model failed");
        await stopModel(modelID);
      });
      currentCount = currentCount + 2;
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [currentCount, num * 5 + 3],
          pids: pids,
        },
      });
      console.log("sand2txt finished");
      // sand2png
      const snd2pngPromise = async (i: number) => {
        return new Promise((resolve, reject) => {
          let stdout = "";
          let stderr = "";
          const cp = spawn(
            `conda activate gis && python ${
              path.resolve("./").split("\\").join("/") +
              "/src/utils/water/sand2png.py" +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/sand/snd_${timeStamp}_${i}.txt` +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/sand` +
              " " +
              `${dataFoldURL}${
                datasetInfo!.path
              }/transform/mesh/${(meshFileName as string)!.replace("gr3", "shp")}`
            }`,
            { shell: true, windowsHide: true }
          );
          cp.stdout.on("data", function (chunk) {
            stdout += chunk;
          });
          cp.stderr.on("data", function (chunk) {
            stderr += chunk;
          });
          cp.on("close", function (code) {
            if (code === 0) {
              resolve(stdout);
            } else {
              reject(stderr);
            }
          });
        });
      };
      const yuji2pngPromise = async (i: number) => {
        return new Promise((resolve, reject) => {
          let stdout = "";
          let stderr = "";
          const cp = spawn(
            `conda activate gis && python ${
              path.resolve("./").split("\\").join("/") +
              "/src/utils/water/sand2png.py" +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/sand/yuji_${timeStamp}_${i}.txt` +
              " " +
              `${dataFoldURL}${datasetInfo!.path}/transform/sand` +
              " " +
              `${dataFoldURL}${
                datasetInfo!.path
              }/transform/mesh/${(meshFileName as string)!.replace("gr3", "shp")}`
            }`,
            { shell: true, windowsHide: true }
          );
          cp.stdout.on("data", function (chunk) {
            stdout += chunk;
          });
          cp.stderr.on("data", function (chunk) {
            stderr += chunk;
          });
          cp.on("close", function (code) {
            if (code === 0) {
              resolve(stdout);
            } else {
              reject(stderr);
            }
          });
        });
      };
      for (let index = 0; index < num; index++) {
        await yuji2pngPromise(index).catch(async () => {
          console.log("model failed");
          await stopModel(modelID);
        });
        await snd2pngPromise(index).catch(async () => {
          console.log("model failed");
          await stopModel(modelID);
        });
        currentCount = currentCount + 2;
        await prisma.model_info.update({
          where: { id: modelID },
          data: {
            progress: [currentCount, num * 5 + 3],
            pids: pids,
          },
        });
      }
      console.log("sand2png finished");
      // update record
      await prisma.data.updateMany({
        where: {
          dataset: datasetID,
        },
        data: {
          transformPath: [
            `${datasetInfo!.path}/transform/sand`,
            num.toString(),
            timeStamp.toString(),
          ],
        },
      });
      currentCount = currentCount + 1;
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [currentCount, num * 5 + 3],
          pids: pids,
          is_running: false,
        },
      });
      console.log("all finished");
    });
  } catch (error) {
    await stopModel(modelID);
    if (error instanceof Error) {
      console.log(error.message);
    } else;
  }
};

const copyModelData = async (
  datasetID: string,
  modelInfoID: string,
  datasetPath: string,
  datasetTimeStamp: string,
  paramKeys: string[]
) => {
  let meshFileName: string | undefined = undefined;
  let extent: number[] | undefined = undefined;
  const promises = paramKeys.map(async (key) => {
    const fileInfo = await prisma.data.findUnique({
      where: {
        id: key,
      },
    });
    if (!fileInfo) {
      await stopModel(modelInfoID);
      return;
    } else;
    // copy uvet data
    if (fileInfo.style === "water") {
      const datasetOfFile = await prisma.dataset.findUnique({
        where: {
          id: fileInfo.dataset,
        },
      });
      const src1 = dataFoldURL + datasetOfFile!.path + "/model/et.dat";
      const src2 = dataFoldURL + datasetOfFile!.path + "/model/vn.dat";
      const src3 = dataFoldURL + datasetOfFile!.path + "/model/vt.dat";
      const dst1 = dataFoldURL + datasetPath + "/model/et.dat";
      const dst2 = dataFoldURL + datasetPath + "/model/vn.dat";
      const dst3 = dataFoldURL + datasetPath + "/model/vt.dat";
      await copyFile(src1, dst1);
      await copyFile(src2, dst2);
      await copyFile(src3, dst3);
      return;
    } else;
    // copy model data
    const datasetTimeStampOfFile = fileInfo.path.match(/\d*(?=.input)/)!.toString();
    const src = dataFoldURL + fileInfo.path;
    const dst = src.replace(datasetTimeStampOfFile!, datasetTimeStamp);
    if (datasetTimeStampOfFile !== datasetTimeStamp) {
      await copyFile(src, dst);
    } else;
    await copyFile(src, dst.replace("input", "model").replace(`_${fileInfo.timeStamp}`, ""));
    // copy transform
    const transform = fileInfo.transformPath;
    if (transform.length) {
      const datasetTimeStampOfFile = fileInfo.transformPath[0]
        .match(/\d*(?=.transform)/)!
        .toString();
      const source = dataFoldURL + fileInfo.transformPath[0];
      const target = source.replace(datasetTimeStampOfFile!, datasetTimeStamp);
      if (datasetTimeStampOfFile !== datasetTimeStamp) {
        if ((await lstat(source)).isFile()) {
          await copySelectFilesInFolder(dirname(source), dirname(target), [fileInfo.timeStamp]);
        } else {
          await copySelectFilesInFolder(source, target, [fileInfo.timeStamp]);
        }
      } else;
    } else;
    // find mesh
    if (fileInfo.type === "mesh") {
      meshFileName = path.basename(fileInfo.path);
      extent = fileInfo.extent;
    } else;
  });
  await Promise.all(promises);
  return [meshFileName, extent];
};

const getModel = async (modelInfoID: string) => {
  const modelInfo = await prisma.model_info.findUnique({ where: { id: modelInfoID } });
  if (!modelInfo) {
    return { status: "fail", content: "模型信息不存在" };
  } else;
  return { status: "success", content: modelInfo };
};

const stopModel = async (modelInfoID: string) => {
  // get modelInfo
  const modelInfo = await prisma.model_info.findUnique({
    where: { id: modelInfoID },
  });
  // NOTE
  // delete all programs by pid
  const killPidPromise = async (pid: string) => {
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";
      const cp = spawn(`taskkill /f /t /pid ${pid}`, { shell: true, windowsHide: true });
      cp.stdout.on("data", function (chunk) {
        stdout += chunk;
      });
      cp.stderr.on("data", function (chunk) {
        stderr += chunk;
      });
      cp.on("close", function (code) {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(stderr);
        }
      });
    });
  };
  for (let index = 0; index < modelInfo!.pids.length; index++) {
    const pid = modelInfo!.pids[index];
    await killPidPromise(pid).catch(() => {});
  }
  // delete modelInfo
  await prisma.model_info.delete({
    where: {
      id: modelInfoID,
    },
  });
  // delete dataset
  setTimeout(async () => {
    await datasetService.deleteDataset(modelInfo!.dataset!);
    return { status: "success", content: "stop succeed" };
  }, 1000);
};

export const modelService = {
  R_test2,
  R_test3,
  runHydrodynamics,
  runQuality,
  runSand,
  stopModel,
  getModel,
};
