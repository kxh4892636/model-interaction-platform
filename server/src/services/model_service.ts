import { Request, Response } from "express";
import { PrismaClient, dataset } from "@prisma/client";
import { dataFoldURL } from "../config/global_data";
import { copyFile, lstatSync, rename } from "fs";
import path, { dirname, resolve } from "path";
import crypto from "crypto";
import { spawn, spawnSync, exec, execSync } from "child_process";
import {
  copyFolderSync,
  copySelectFilesInFolderSync,
  deleteFolderFilesSync,
  deleteFolderSync,
} from "../utils/tools/fs_action";
import { query } from "../utils/ewe/importEWE";
import { CRUDdatabase, HandleReturn, FlowDiagram, ModifyDatabase } from "../utils/ewe/exportEWE";
import { datasetService } from "./dataset_service";
const prisma = new PrismaClient();

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
    const stdout = execSync(`Rscript ./src/utils/ewe/EcoPath.R '${num}'`, { windowsHide: true });
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
    const stdout = execSync(`Rscript ./src/utils/ewe/EcoPath.R '${num}'`, { windowsHide: true });
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
  const ADODB = require("node-adodb");
  const info = await prisma.data.findUnique({ where: { id: req.body.id } });
  const connection = ADODB.open(
    `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${
      dataFoldURL + info!.path
    };Persist Security Info=False;`
  );
  const result = await query(connection);
  return result;
};

// // transform null
// if (type) {
//     const result = spawn(`taskkill /f /t /pid ${type}`, { shell: true, windowsHide: true });
//     result.stdout.on("end", () => {
//       return { status: "success", content: "kill" };
//     });
//   }

// 水动力模型计算接口
const runHydrodynamics = async (
  paramKeys: string[],
  projKey: string,
  title: string,
  projectID: string,
  res: Response
) => {
  // create the record and folder of model
  const timeStamp = Date.now().toString();
  const result = await datasetService.addDataset(title, projectID);
  const datasetID = result.content;
  const datasetInfo = await prisma.dataset.findUnique({
    where: {
      id: datasetID,
    },
  });

  let keys: string[] = paramKeys;
  projKey && keys.push(projKey);
  let meshFileName: string | undefined = undefined;
  let extent: number[] | undefined = undefined;
  // copy data by key
  for (let index = 0; index < paramKeys.length; index++) {
    const key = paramKeys[index];
    const fileInfo = await prisma.data.findUnique({
      where: {
        id: key,
      },
    });
    if (!fileInfo) {
      isModelFailed(datasetInfo!.id, dataFoldURL + datasetInfo!.path);
      throw new Error("模型参数文件请重新上传");
    } else;
    // copy model data
    const datasetTimeStampOfFile = fileInfo.path.match(/\d*(?=.input)/)!.toString();
    const src = dataFoldURL + fileInfo.path;
    const dst = src.replace(datasetTimeStampOfFile!, datasetInfo!.timeStamp);
    if (datasetTimeStampOfFile !== datasetInfo!.timeStamp) {
      copyFile(src, dst, (err) => {
        if (err) {
          isModelFailed(datasetInfo!.id, dataFoldURL + datasetInfo!.path);
          throw err;
        } else;
      });
    } else;
    copyFile(src, dst.replace("input", "model").replace(`_${fileInfo.timeStamp}`, ""), (err) => {
      if (err) {
        isModelFailed(datasetInfo!.id, dataFoldURL + datasetInfo!.path);
        throw err;
      } else;
    });
    // copy transform
    const transform = fileInfo.transformPath;
    if (transform.length) {
      const datasetTimeStampOfFile = fileInfo.transformPath[0]
        .match(/\d*(?=.transform)/)!
        .toString();
      const source = dataFoldURL + fileInfo.transformPath[0];
      const target = source.replace(datasetTimeStampOfFile!, datasetInfo!.timeStamp);
      if (datasetTimeStampOfFile !== datasetInfo!.timeStamp) {
        if (lstatSync(source).isFile()) {
          copySelectFilesInFolderSync(dirname(source), dirname(target), [fileInfo.timeStamp]);
        } else {
          copySelectFilesInFolderSync(source, target, [fileInfo.timeStamp]);
        }
      } else;
    } else;
    // find mesh
    if (fileInfo.type === "mesh") {
      meshFileName = path.basename(fileInfo.path);
      extent = fileInfo.extent;
    } else;
  }
  if (!meshFileName) {
    isModelFailed(datasetInfo!.id, dataFoldURL + datasetInfo!.path);
    throw new Error("mesh 参数文件不存在");
  } else;
  // create the record fo result
  const uvID = crypto.randomUUID();
  const uvetPath = datasetInfo!.path + "/model/uvet.dat";
  await prisma.data.create({
    data: {
      path: uvetPath,
      id: uvID,
      style: "flow",
      title: "uvet流场数据",
      type: "uvet",
      extent: extent!,
      progress: [],
      dataset: datasetID,
      input: false,
      timeStamp: timeStamp,
    },
  });

  // run model
  const modelPath = dataFoldURL + datasetInfo!.path + "/model/model.exe";
  const outputModel = spawn(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
    shell: true,
    windowsHide: true,
  });

  let currentCount = 0;
  let num: number = 0;
  outputModel.stderr.on("data", async () => {
    console.log("model failed");
    isModelFailed(datasetInfo!.id, dataFoldURL + datasetInfo!.path);
    if (num === 0) {
      res.status(200).json({ status: "fail", content: "模型参数错误" });
    } else;
  });
  outputModel.stdout?.on("data", async (chunk) => {
    const content = chunk.toString();
    console.log(content);
    if (content.includes("rnday")) {
      num = Number(content.match(/\d*\.\d{1,6}/)![0]) * 24;
      // init the progress of result
      await prisma.data.updateMany({
        where: {
          id: uvID,
        },
        data: {
          progress: ["0", `${6 * num + 2}`],
        },
      });
      res
        .status(200)
        .json({ status: "success", content: [datasetInfo!.id, outputModel.pid, [uvID]] });
    } else;
    if (content.includes("nt,it")) {
      // update the progress of result
      currentCount = currentCount + 4;
      await prisma.data.updateMany({
        where: {
          id: uvID,
        },
        data: {
          progress: [`${currentCount}`, `${6 * num + 2}`],
        },
      });
    }
  });
  outputModel.stdout?.on("end", async () => {
    // same as stderr
    if (!currentCount || currentCount !== 4 * num) {
      console.log(currentCount, num);
      isModelFailed(datasetInfo!.id, dataFoldURL + datasetInfo!.path);
      return;
    } else;
    console.log("model finished");
    // uvet2txt
    spawnSync(
      `conda activate gis && python ${
        path.resolve("./").split("\\").join("/") +
        "/src/utils/hydrodynamics/uvet2txt.py" +
        " " +
        `${dataFoldURL}${datasetInfo!.path}/model/uvet.dat` +
        " " +
        `${dataFoldURL}${datasetInfo!.path}/transform/uvet` +
        " " +
        `${dataFoldURL}${datasetInfo!.path}/transform/mesh/${meshFileName!.replace("gr3", "csv")}` +
        " " +
        num +
        " " +
        timeStamp
      }`,
      { shell: true, windowsHide: true }
    );
    console.log("uvet2txt finished");
    // uvet2description
    spawn(
      `conda activate gis && python ${
        path.resolve("./").split("\\").join("/") +
        "/src/utils/hydrodynamics/uvet2description.py" +
        " " +
        `${dataFoldURL}${datasetInfo!.path}/transform/uvet/description_${timeStamp}.json` +
        " " +
        `${datasetInfo!.path}/transform/uvet/` +
        " " +
        timeStamp +
        " " +
        `${datasetInfo!.path}/transform/uvet/` +
        " " +
        extent!.join(",") +
        " " +
        `../mesh/${meshFileName!.replace("gr3", "shp")}` +
        " " +
        num
      }`,
      { shell: true, windowsHide: true }
    );
    console.log("uvet2description finished");
    // uvet process
    await prisma.data.updateMany({
      where: {
        id: uvID,
      },
      data: {
        transformPath: [
          `${datasetInfo!.path}/transform/uvet`,
          num.toString(),
          timeStamp.toString(),
        ],
      },
    });
    const processPath = resolve("./").split("\\").join("/") + "/src/utils/process/process.exe";
    const descriptionPath =
      dataFoldURL + datasetInfo!.path + "/transform/uvet/description_" + timeStamp + ".json";
    // NOTE 不知道为什么, 加一个 setTImeout 就可以, 而且延时时间要多一点
    setTimeout(() => {
      const output = spawn(processPath + " " + descriptionPath, {
        shell: true,
        windowsHide: true,
      });
      output.stdout?.on("data", async (chunk) => {
        const content = chunk.toString();
        // console.log(content);
        if (content.includes("uvet")) {
          currentCount = currentCount + 1;
          await prisma.data.updateMany({
            where: {
              id: uvID,
            },
            data: {
              progress: [`${currentCount}`, `${6 * num + 2}`],
            },
          });
        } else;
      });
      output.stdout.on("end", () => {
        const renameFiles = async (timeStamp: string, num: number) => {
          const descriptionPath = `${dataFoldURL}${
            datasetInfo!.path
          }/transform/uvet/flow_field_description.json`;
          for (let index = 0; index < num; index++) {
            const uvPath = `${dataFoldURL}${datasetInfo!.path}/transform/uvet/uv_${index}.png`;
            const maskPath = `${dataFoldURL}${datasetInfo!.path}/transform/uvet/mask_${index}.png`;
            const validPath = `${dataFoldURL}${
              datasetInfo!.path
            }/transform/uvet/valid_${index}.png`;
            rename(
              uvPath,
              uvPath.replace(`uv_${index}.png`, `uv_${timeStamp}_${index}.png`),
              () => {}
            );
            rename(
              maskPath,
              maskPath.replace(`mask_${index}.png`, `mask_${timeStamp}_${index}.png`),
              () => {}
            );
            rename(
              validPath,
              validPath.replace(`valid_${index}.png`, `valid_${timeStamp}_${index}.png`),
              () => {}
            );
          }
          rename(
            descriptionPath,
            descriptionPath.replace(
              `flow_field_description.json`,
              `flow_field_description_${timeStamp}.json`
            ),
            () => {}
          );
        };
        renameFiles(timeStamp, num).then(async () => {
          currentCount = currentCount + 2;
          await prisma.data.updateMany({
            where: {
              id: uvID,
            },
            data: {
              progress: [`${currentCount}`, `${6 * num + 2}`],
            },
          });
        });
        console.log("all finished");
      });
    }, 1000);
  });
};

const isModelFailed = async (datasetID: string, path: string) => {
  setTimeout(async () => {
    deleteFolderSync(path);
    await prisma.data.deleteMany({
      where: {
        dataset: datasetID,
      },
    });
  }, 1000);
};

export const modelService = { R_test2, R_test3, runHydrodynamics };
