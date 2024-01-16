import crypto from "crypto";
import { execa } from "execa";
import { Request, Response } from "express";
import { copyFile, lstat, readFile, rename } from "fs/promises";
import iconv from "iconv-lite";
import ADODB from "node-adodb";
import path, { dirname, resolve } from "path";
import { dataFoldURL } from "../config/global_data";
import { copySelectFilesInFolder } from "../utils/tools/fs_extra";
import { prisma } from "../utils/tools/prisma";
import { datasetService } from "./dataset_service";
import { visualizationService } from "./visualization_service";


// 水动力模型计算接口
const runHydrodynamics = async (
  paramKeys: string,
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
    res.write(
      `id: ${Date.now()}\n` +
        `data:  ${JSON.stringify({
          status: "success",
          content: [datasetID, modelID, [uvID]],
        })}\n\n`
    );

    // define keys of param
    let keys: string[] = paramKeys.split(",");
    projKey && keys.push(projKey);

    // copy model data by key
    res.write(`id: ${Date.now()}\n` + `data:  ${"开始导入输入参数"}\n\n`);
    const [meshFileName, extent, meshKey] = await copyModelData(
      modelID,
      datasetInfo!.timeStamp,
      paramKeys.split(",")
    );
    if (!meshFileName) {
      res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);
      await stopModel(modelID);
      throw new Error("mesh 参数文件不存在");
    } else;
    if (!extent) {
      res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);
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
        params: paramKeys.split(","),
      },
    });
    await prisma.dataset.update({
      where: { id: datasetID },
      data: {
        data: [...datasetInfo!.data, uvID],
      },
    });

    // get model param
    const paramContent = (
      await readFile(dataFoldURL + datasetInfo!.path + "/model/paramhk.in")
    )
      .toString()
      .split("\r\n");
    let num = Number(paramContent[11].split(/\s/)[0]) * 24;
    let currentCount = 0;

    // run model
    res.write(
      `id: ${Date.now()}\n` + `data:  ${"导入输入参数完成, 开始运行模型"}\n\n`
    );
    const modelPath = dataFoldURL + datasetInfo!.path + "/model/elcirc.exe";
    const outputModel = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
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

    outputModel.on("error", async () => {
      console.log("model failed");
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [currentCount, num * 5 + 3],
          pids: [],
        },
      });
      res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);
      await stopModel(modelID);
    });

    outputModel.stdout!.on("data", async (chunk) => {
      const content = chunk.toString();
      console.log(content);
      res.write(`data:  ${content}\n\n`);
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

    outputModel.on("exit", async (code) => {
      if (code) return;
      else;
      pids.shift();
      console.log("model finish");
      res.write(`data: model finish\n\n`);

      // uvet2txt
      const result = execa(
        `conda activate gis && python ${
          path.resolve("./").split("\\").join("/") +
          "/src/utils/water/uvet2txt.py" +
          " " +
          `${dataFoldURL}${datasetInfo!.path}/model/uvet.dat` +
          " " +
          `${dataFoldURL}${datasetInfo!.path}/transform/water` +
          " " +
          `${dataFoldURL}${datasetInfo!.path}/transform/mesh/${(
            meshFileName as string
          ).replace("gr3", "csv")}` +
          " " +
          num +
          " " +
          timeStamp
        }`,
        { shell: true, windowsHide: true }
      );
      pids.push(result.pid!.toString());

      result.on("error", async () => {
        console.log("model failed");
        res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);
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

        console.log("uvet2txt finish");
        res.write(`data: uvet2txt finish\n\n`);

        // uvet2description
        const result = execa(
          `conda activate gis && python ${
            path.resolve("./").split("\\").join("/") +
            "/src/utils/water/uvet2description.py" +
            " " +
            `${dataFoldURL}${
              datasetInfo!.path
            }/transform/water/description_${timeStamp}.json` +
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

        result.on("error", async () => {
          console.log("model failed");
          res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);
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
          console.log("uvet2description finish");
          res.write(`data: uvet2description finish\n\n`);

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
            resolve("./").split("\\").join("/") +
            "/src/utils/process/process.exe";
          const descriptionPath =
            dataFoldURL +
            datasetInfo!.path +
            "/transform/water/description_" +
            timeStamp +
            ".json";
          console.log(processPath + " " + descriptionPath);
          const output = execa(processPath + " " + descriptionPath, {
            shell: true,
            windowsHide: true,
          });
          pids.push(output.pid!.toString());

          result.on("error", async () => {
            console.log("model failed");
            res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);
            await stopModel(modelID);
          });

          output.stdout!.on("data", async (chunk) => {
            const content = chunk.toString();
            console.log(content);
            res.write(`data: ${content}\n\n`);
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
            console.log("process finish");
            res.write(`data: process finish\n\n`);

            // rename
            const descriptionPath = `${dataFoldURL}${
              datasetInfo!.path
            }/transform/water/flow_field_description.json`;
            for (let index = 0; index < num; index++) {
              const uvPath = `${dataFoldURL}${
                datasetInfo!.path
              }/transform/water/uv_${index}.png`;
              const maskPath = `${dataFoldURL}${
                datasetInfo!.path
              }/transform/water/mask_${index}.png`;
              const validPath = `${dataFoldURL}${
                datasetInfo!.path
              }/transform/water/valid_${index}.png`;
              await rename(
                uvPath,
                uvPath.replace(
                  `uv_${index}.png`,
                  `uv_${timeStamp}_${index}.png`
                )
              );
              await rename(
                maskPath,
                maskPath.replace(
                  `mask_${index}.png`,
                  `mask_${timeStamp}_${index}.png`
                )
              );
              await rename(
                validPath,
                validPath.replace(
                  `valid_${index}.png`,
                  `valid_${timeStamp}_${index}.png`
                )
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

            await prisma.dataset.update({
              where: {
                id: datasetID,
              },
              data: {
                status: 1,
              },
            });

            console.log("all finish");
            res.write(`data: all finish\n\n`);
          });
        });
      });
    });
  } catch (error) {
    res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);

    await stopModel(modelID);

    if (error instanceof Error) {
      console.log(error.message);
    } else;
  }
};

const runQuality = async (
  waterKey: string,
  paramKeys: string,
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
    const waterKeyInfo = await prisma.data.findUnique({
      where: {
        id: waterKey,
      },
    });
    const waterInfo = await prisma.dataset.findUnique({
      where: {
        id: waterKeyInfo!.dataset,
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
    res.write(
      `id: ${Date.now()}\n` +
        `data:  ${JSON.stringify({
          status: "success",
          content: [datasetID, modelID, []],
        })}\n\n`
    );
    // define keys of param
    let keys: string[] = paramKeys.split(",");
    projKey && keys.push(projKey);

    // copy model data by key
    res.write(`id: ${Date.now()}\n` + `data:  ${"开始导入输入参数"}\n\n`);
    const [meshFileName, extent, meshKey] = await copyModelData(
      modelID,
      waterInfo!.timeStamp,
      [...paramKeys.split(","), ...waterKeyInfo!.params]
    );
    if (!meshFileName) {
      res.write(
        `id: ${Date.now()}\n` +
          `data:  ${JSON.stringify({ status: "fail" })}\n\n`
      );
      await stopModel(modelID);
      throw new Error("mesh 参数文件不存在");
    } else;
    if (!extent) {
      res.write(
        `id: ${Date.now()}\n` +
          `data:  ${JSON.stringify({ status: "fail" })}\n\n`
      );
      await stopModel(modelID);
      throw new Error("未成功获取 mesh 的范围");
    }

    // get model param
    const datContent = await readFile(
      dataFoldURL + waterInfo!.path + "/model/初始浓度.dat"
    );
    const resultNum = datContent.toString().split("\r\n").length;
    const resultFolder = datasetInfo!.path + "/model";
    const paramContent = (
      await readFile(
        dataFoldURL + waterInfo!.path + "/model/wuran-gongkuang.dat"
      )
    )
      .toString()
      .split("\r\n");
    let num = Number(paramContent[9].split(/\s/)[0]) * 24;
    let currentCount = 0;
    // create the record fo result
    let resultIDs: string[] = [];
    const titles: string[] = [
      "溶解氧",
      "BOD",
      "浮游植物",
      "氨氮",
      "硝酸盐氮",
      "有机氮",
      "无机磷",
      "有机磷",
    ];
    for (let index = 0; index < resultNum; index++) {
      const id = crypto.randomUUID();
      await prisma.data.create({
        data: {
          path: resultFolder + `/tnd${index + 1}.dat`,
          id: id,
          style: "quality",
          title: `${index}_${titles[index]}`,
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
    res.write(
      `id: ${Date.now()}\n` + `data:  ${"导入输入参数完成, 开始运行模型"}\n\n`
    );
    const modelPath = dataFoldURL + waterInfo!.path + "/model/quality.exe";
    const outputModel = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
      shell: true,
      windowsHide: true,
    });
    pids.push(outputModel.pid!.toString());
    await prisma.model_info.update({
      where: { id: modelID },
      data: {
        progress: [currentCount, num * 5 + 3 * num * resultNum + resultNum + 1],
        pids: pids,
      },
    });
    outputModel.on("error", async () => {
      console.log("model failed");
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [
            currentCount,
            num * 5 + 3 * num * resultNum + resultNum + 1,
          ],
          pids: [],
        },
      });
      res.write(
        `id: ${Date.now()}\n` +
          `data:  ${JSON.stringify({ status: "fail" })}\n\n`
      );
      await stopModel(modelID);
    });
    outputModel.stdout!.on("data", async (chunk) => {
      const content = iconv.decode(chunk, "gbk");
      console.log(content);
      res.write(`id: ${Date.now()}\n` + `data:  ${content}\n\n`);
      if (content.includes("time")) {
        // update the progress of result
        currentCount = currentCount + 5;
        await prisma.model_info.update({
          where: { id: modelID },
          data: {
            progress: [
              currentCount,
              num * 5 + 3 * num * resultNum + resultNum + 1,
            ],
            pids: pids,
          },
        });
      }
    });
    outputModel.on("exit", async (code) => {
      if (code) return;
      else;
      pids.shift();
      console.log("model finish");
      res.write(`id: ${Date.now()}\n` + `data: model finish\n\n`);
      // tnd2txt
      let promises = [];
      for (let i = 0; i < resultNum; i++) {
        const promise = execa(
          `conda activate gis && python ${
            path.resolve("./").split("\\").join("/") +
            "/src/utils/water/tnd2txt.py" +
            " " +
            `${dataFoldURL}${waterInfo!.path}/model/tnd${i + 1}.dat` +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/transform/quality` +
            " " +
            `${dataFoldURL}${waterInfo!.path}/transform/mesh/${(
              meshFileName as string
            ).replace("gr3", "csv")}` +
            " " +
            num +
            " " +
            timeStamp
          }`,
          { shell: true, windowsHide: true }
        );
        pids.push(promise.pid!.toString());
        promise
          .then(async () => {
            currentCount = currentCount + 1;
            pids = pids.filter((pid) => pid !== promise.pid!.toString());
            await prisma.model_info.update({
              where: { id: modelID },
              data: {
                progress: [
                  currentCount,
                  num * 5 + 3 * num * resultNum + resultNum + 1,
                ],
                pids: pids,
              },
            });
            res.write(
              `id: ${Date.now()}\n` + `data:  ${`tnd_${i} finish`}\n\n`
            );
            resolve("1");
          })
          .catch(async () => {
            console.log("model failed");
            res.write(
              `id: ${Date.now()}\n` +
                `data:  ${JSON.stringify({ status: "fail" })}\n\n`
            );
            await stopModel(modelID);
          });
        promises.push(promise);
      }
      await Promise.all(promises).catch(async () => {
        console.log("model failed");
        await stopModel(modelID);
      });
      console.log("tnd2txt finish");
      res.write(`id: ${Date.now()}\n` + `data:  ${`tnd2txt finish`}\n\n`);
      // tnd2png
      for (let i = 0; i < num; i++) {
        for (let j = 0; j < resultNum; j++) {
          const promise = execa(
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
              `${dataFoldURL}${waterInfo!.path}/transform/mesh/${(
                meshFileName as string
              ).replace("gr3", "shp")}`
            }`,
            { shell: true, windowsHide: true }
          );
          pids.push(promise.pid!.toString());
          promise
            .then(async () => {
              currentCount = currentCount + 3;
              pids = pids.filter((pid) => pid !== promise.pid!.toString());
              await prisma.model_info.update({
                where: { id: modelID },
                data: {
                  progress: [
                    currentCount,
                    num * 5 + 3 * num * resultNum + resultNum + 1,
                  ],
                  pids: pids,
                },
              });
              res.write(
                `id: ${Date.now()}\n` +
                  `data:  ${`tnd_${j}_${i} to png finish`}\n\n`
              );
              resolve("1");
            })
            .catch(async () => {
              console.log("model failed");
              res.write(
                `id: ${Date.now()}\n` +
                  `data:  ${JSON.stringify({ status: "fail" })}\n\n`
              );
              await stopModel(modelID);
            });
          await promise;
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
          progress: [
            currentCount,
            num * 5 + 3 * num * resultNum + resultNum + 1,
          ],
          pids: pids,
          is_running: false,
        },
      });

      await prisma.dataset.update({
        where: {
          id: datasetID,
        },
        data: {
          status: 1,
        },
      });
      console.log("all finish");
      res.write(`id: ${Date.now()}\n` + `data:  ${`all finish`}\n\n`);
    });
  } catch (error) {
    res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);
    await stopModel(modelID);
    if (error instanceof Error) {
      console.log(error);
    } else;
  }
};

const runSand = async (
  waterKey: string,
  paramKeys: string,
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
    const waterKeyInfo = await prisma.data.findUnique({
      where: {
        id: waterKey,
      },
    });
    const waterInfo = await prisma.dataset.findUnique({
      where: {
        id: waterKeyInfo!.dataset,
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
    res.write(
      `id: ${Date.now()}\n` +
        `data:  ${JSON.stringify({
          status: "success",
          content: [datasetID, modelID, [sndID, yujiID]],
        })}\n\n`
    );
    // define keys of param
    let keys: string[] = paramKeys.split(",");
    projKey && keys.push(projKey);
    // copy model data by key
    res.write(`id: ${Date.now()}\n` + `data:  ${"开始导入输入参数"}\n\n`);
    const [meshFileName, extent, meshKey] = await copyModelData(
      modelID,
      waterInfo!.timeStamp,
      [...paramKeys.split(","), ...waterKeyInfo!.params]
    );
    if (!meshFileName) {
      res.write(
        `id: ${Date.now()}\n` +
          `data:  ${JSON.stringify({ status: "fail" })}\n\n`
      );
      await stopModel(modelID);
      throw new Error("mesh 参数文件不存在");
    } else;
    if (!extent) {
      res.write(
        `id: ${Date.now()}\n` +
          `data:  ${JSON.stringify({ status: "fail" })}\n\n`
      );
      await stopModel(modelID);
      throw new Error("未成功获取 mesh 的范围");
    }
    // get model param
    const resultFolder = datasetInfo!.path + "/model";
    const paramContent = (
      await readFile(
        dataFoldURL + waterInfo!.path + "/model/wuran-gongkuang.dat"
      )
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
        title: `泥沙`,
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
        title: `淤积`,
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
    res.write(
      `id: ${Date.now()}\n` + `data:  ${"导入输入参数完成, 开始运行模型"}\n\n`
    );
    const modelPath = dataFoldURL + waterInfo!.path + "/model/sand.exe";
    const outputModel = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
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
    outputModel.on("error", async () => {
      console.log("model failed");
      res.write(
        `id: ${Date.now()}\n` +
          `data:  ${JSON.stringify({ status: "fail" })}\n\n`
      );
      await prisma.model_info.update({
        where: { id: modelID },
        data: {
          progress: [currentCount, num * 5 + 3],
          pids: [],
        },
      });
      await stopModel(modelID);
    });
    outputModel.stdout!.on("data", async (chunk) => {
      const content = chunk.toString();
      console.log(content);
      res.write(`id: ${Date.now()}\n` + `data:  ${content}\n\n`);
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
      console.log("model finish");
      res.write(`id: ${Date.now()}\n` + `data:  model finish\n\n`);
      // tnd2txt
      const p1 = execa(
        `conda activate gis && python ${
          path.resolve("./").split("\\").join("/") +
          "/src/utils/water/sand2txt.py" +
          " " +
          `${dataFoldURL}${waterInfo!.path}/model/snd.dat` +
          " " +
          `${dataFoldURL}${datasetInfo!.path}/transform/sand` +
          " " +
          `${dataFoldURL}${
            waterInfo!.path
          }/transform/mesh/${(meshFileName as string)!.replace("gr3", "csv")}` +
          " " +
          num +
          " " +
          timeStamp
        }`,
        { shell: true, windowsHide: true }
      );
      pids.push(p1.pid!.toString());
      p1.then(async () => {
        currentCount = currentCount + 1;
        pids = pids.filter((pid) => pid !== p1.pid!.toString());
        await prisma.model_info.update({
          where: { id: modelID },
          data: {
            progress: [currentCount, num * 5 + 3],
            pids: pids,
          },
        });
        res.write(`id: ${Date.now()}\n` + `data:  snd2txt finish\n\n`);
        resolve("1");
      }).catch(async () => {
        console.log("model failed");
        res.write(
          `id: ${Date.now()}\n` +
            `data:  ${JSON.stringify({ status: "fail" })}\n\n`
        );
        await stopModel(modelID);
      });
      const p2 = execa(
        `conda activate gis && python ${
          path.resolve("./").split("\\").join("/") +
          "/src/utils/water/sand2txt.py" +
          " " +
          `${dataFoldURL}${waterInfo!.path}/model/yuji.dat` +
          " " +
          `${dataFoldURL}${datasetInfo!.path}/transform/sand` +
          " " +
          `${dataFoldURL}${
            waterInfo!.path
          }/transform/mesh/${(meshFileName as string)!.replace("gr3", "csv")}` +
          " " +
          num +
          " " +
          timeStamp
        }`,
        { shell: true, windowsHide: true }
      );
      pids.push(p2.pid!.toString());
      p2.then(async () => {
        currentCount = currentCount + 1;
        pids = pids.filter((pid) => pid !== p2.pid!.toString());
        res.write(`id: ${Date.now()}\n` + `data:  yuji2txt finish\n\n`);
        await prisma.model_info.update({
          where: { id: modelID },
          data: {
            progress: [currentCount, num * 5 + 3],
            pids: pids,
          },
        });
        resolve("1");
      }).catch(async () => {
        console.log("model failed");
        res.write(
          `id: ${Date.now()}\n` +
            `data:  ${JSON.stringify({ status: "fail" })}\n\n`
        );
        await stopModel(modelID);
      });
      await Promise.all([p1, p2]).catch(async () => {
        res.write(
          `id: ${Date.now()}\n` +
            `data:  ${JSON.stringify({ status: "fail" })}\n\n`
        );
        console.log("model failed");
        await stopModel(modelID);
      });
      console.log("sand2txt finish");
      res.write(`id: ${Date.now()}\n` + `data:  sand2txt finish\n\n`);
      // sand2png
      for (let index = 0; index < num; index++) {
        const p1 = execa(
          `conda activate gis && python ${
            path.resolve("./").split("\\").join("/") +
            "/src/utils/water/sand2png.py" +
            " " +
            `${dataFoldURL}${
              datasetInfo!.path
            }/transform/sand/snd_${timeStamp}_${index}.txt` +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/transform/sand` +
            " " +
            `${dataFoldURL}${
              waterInfo!.path
            }/transform/mesh/${(meshFileName as string)!.replace("gr3", "shp")}`
          }`,
          { shell: true, windowsHide: true }
        );
        pids.push(p1.pid!.toString());
        p1.then(async () => {
          currentCount = currentCount + 1;
          pids = pids.filter((pid) => pid !== p1.pid!.toString());
          res.write(
            `id: ${Date.now()}\n` + `data:  snd_${index}2png finish\n\n`
          );
          await prisma.model_info.update({
            where: { id: modelID },
            data: {
              progress: [currentCount, num * 5 + 3],
              pids: pids,
            },
          });
          resolve("1");
        }).catch(async () => {
          console.log("model failed");
          res.write(
            `id: ${Date.now()}\n` +
              `data:  ${JSON.stringify({ status: "fail" })}\n\n`
          );
          await stopModel(modelID);
        });
        await p1;
        const p2 = execa(
          `conda activate gis && python ${
            path.resolve("./").split("\\").join("/") +
            "/src/utils/water/sand2png.py" +
            " " +
            `${dataFoldURL}${
              datasetInfo!.path
            }/transform/sand/yuji_${timeStamp}_${index}.txt` +
            " " +
            `${dataFoldURL}${datasetInfo!.path}/transform/sand` +
            " " +
            `${dataFoldURL}${
              waterInfo!.path
            }/transform/mesh/${(meshFileName as string)!.replace("gr3", "shp")}`
          }`,
          { shell: true, windowsHide: true }
        );
        pids.push(p2.pid!.toString());
        p2.then(async () => {
          currentCount = currentCount + 1;
          pids = pids.filter((pid) => pid !== p2.pid!.toString());
          res.write(
            `id: ${Date.now()}\n` + `data:  yuji_${index}2png finish\n\n`
          );
          await prisma.model_info.update({
            where: { id: modelID },
            data: {
              progress: [currentCount, num * 5 + 3],
              pids: pids,
            },
          });
          resolve("1");
        }).catch(async () => {
          console.log("model failed");
          res.write(
            `id: ${Date.now()}\n` +
              `data:  ${JSON.stringify({ status: "fail" })}\n\n`
          );
          await stopModel(modelID);
        });
        await p2;
      }
      console.log("sand2png finish");
      res.write(`id: ${Date.now()}\n` + `data: sand2png finish\n\n`);
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

      await prisma.dataset.update({
        where: {
          id: datasetID,
        },
        data: {
          status: 1,
        },
      });
      console.log("all finish");
      res.write(`id: ${Date.now()}\n` + `data: all finish\n\n`);
    });
  } catch (error) {
    res.write(`data:  ${JSON.stringify({ status: "fail" })}\n\n`);
    await stopModel(modelID);
    if (error instanceof Error) {
      console.log(error);
    } else;
  }
};

const copyModelData = async (
  modelInfoID: string,
  datasetTimeStamp: string,
  paramKeys: string[]
): Promise<[string, number[], string] | undefined[]> => {
  let meshFileName: string | undefined = undefined;
  let extent: number[] | undefined = undefined;
  let meshKey: string | undefined = undefined;
  const promises = paramKeys.map(async (key) => {
    let fileInfo = await prisma.data.findUnique({
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
      return;
    } else;
    // find mesh and visualize it
    if (fileInfo.type === "mesh") {
      // mesh2csv
      (await visualizationService.isVisualized(key)).status === "success" ||
        (await visualizationService.visualizeMesh(key));
      fileInfo = await prisma.data.findUnique({
        where: {
          id: key,
        },
      });
      if (!fileInfo) {
        await stopModel(modelInfoID);
        return;
      } else;
      meshKey = key;
      meshFileName = path.basename(fileInfo.path);
      extent = fileInfo.extent;
    } else;
    // copy model data
    const datasetTimeStampOfFile = fileInfo.path
      .match(/\d*(?=.input)/)!
      .toString();
    const src = dataFoldURL + fileInfo.path;
    const dst = src.replace(datasetTimeStampOfFile!, datasetTimeStamp);
    if (datasetTimeStampOfFile !== datasetTimeStamp) {
      await copyFile(src, dst);
    } else;
    await copyFile(
      src,
      dst.replace("input", "model").replace(`_${fileInfo.timeStamp}`, "")
    );
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
          await copySelectFilesInFolder(dirname(source), dirname(target), [
            fileInfo.timeStamp,
          ]);
        } else {
          await copySelectFilesInFolder(source, target, [fileInfo.timeStamp]);
        }
      } else;
    } else;
  });
  await Promise.all(promises);
  return [meshFileName, extent, meshKey];
};

const getModel = async (modelInfoID: string) => {
  const modelInfo = await prisma.model_info.findUnique({
    where: { id: modelInfoID },
  });
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

  // delete all programs by pid
  for (let index = 0; index < modelInfo!.pids.length; index++) {
    const pid = modelInfo!.pids[index];
    await execa(`taskkill /f /t /pid ${pid}`, {
      shell: true,
      windowsHide: true,
    }).catch(() => {});
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
  runHydrodynamics,
  runQuality,
  runSand,
  stopModel,
  getModel,
};
