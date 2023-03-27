import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { dataFoldURL } from "../../config/global_data";
import fs from "fs";
import path, { resolve } from "path";
import crypto from "crypto";
import { exec, execFile, execSync } from "child_process";
import { stderr, stdout } from "process";
const cs = require("child_process");
const { query } = require("../../utils/ewe/importEWE");
const { CRUDdatabase, HandleReturn, FlowDiagram,ModifyDatabase } = require("../../utils/ewe/exportEWE");
const prisma = new PrismaClient();

// 计算结果
exports.R_test2 = (req: Request, res: Response) => {
  const ModelState = req.body.ModelState
  const num = req.body.singleID
  if(ModelState==="Start"){
      const Group = req.body.Group
      const Diet = req.body.Diet
      const Detritus = req.body.Detritus
      const DiscardFate = req.body.DiscardFate
      const Land = req.body.Land
      const Discard = req.body.Discard
      const Fleet = req.body.Fleet
      
      // 全部封到exportEWE中去
      const database = CRUDdatabase(Group,Fleet,Diet,Detritus,DiscardFate,Land,Discard,num)
      // console.log(database)
      database.then(()=>{
          cs.exec(`Rscript ./utils/ewe/EcoPath.R '${num}'` ,(error:any,stdout:any,stderr:any)=>{
              if (error) {
                  console.error('error:', error);
              }
              // [1] TRUE 长度为10 后面还跟着2个空格 10*n-1  5个最后为49  加上“[1] ” 从54开始
              // 如果图标那一块真的要使用图片进行传输的话，多了“pdf 2” 所以要从65开始
              let data = JSON.parse(stdout.slice(54))
              // 得弄两次，第一次弄完还是字符串string类型
              data = JSON.parse(data)
              data.Basic = JSON.parse(data.Basic)
              data.InputFlag = JSON.parse(data.InputFlag)
              data.link = JSON.parse(data.link)
              data.prenode = JSON.parse(data.prenode)
              res.send({BasicEst:HandleReturn(data.Basic,data.InputFlag),Graph:FlowDiagram(data.prenode,data.link),status:data.status,statusname:data.statusname})
          })
      }).catch((err:any)=>console.log(err))
  }
  else if(ModelState==="Modify"){
      const ModifyData = req.body.ModifyData
      const Group = req.body.Group
      const Fleet = req.body.Fleet
      console.log("此次修改的数据为",ModifyData)
      const database = ModifyDatabase(ModifyData,num,Group,Fleet)

      database.then(()=>{
          cs.exec(`Rscript ./utils/ewe/EcoPath.R '${num}'` ,(error:any,stdout:any,stderr:any)=>{
              if (error) {
                  console.error('error:', error);
              }
              // [1] TRUE 长度为10 后面还跟着2个空格 10*n-1  5个最后为49  加上“[1] ” 从54开始
              // 如果图标那一块真的要使用图片进行传输的话，多了“pdf 2” 所以要从65开始
              let data = JSON.parse(stdout.slice(54))
              // 得弄两次，第一次弄完还是字符串string类型
              data = JSON.parse(data)
              // console.log(data.statusname)
              data.Basic = JSON.parse(data.Basic)
              data.InputFlag = JSON.parse(data.InputFlag)
              data.link = JSON.parse(data.link)
              data.prenode = JSON.parse(data.prenode)
              // res.send(data)
              res.send({BasicEst:HandleReturn(data.Basic,data.InputFlag),Graph:FlowDiagram(data.prenode,data.link),status:data.status,statusname:data.statusname})
              // res.send(data)
          })
      }).catch((err:any)=>console.log(err))
  }
  else{
      res.send("请勿重复执行")
  }
};

// 从模型文件按中导入
exports.R_test3 = (req: Request, res: Response) => {
  // console.log("导入模型,test3");
  // console.log(dataFoldURL+req.body.filepath)
  const ADODB = require("node-adodb");
  const connection = ADODB.open(
    `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${dataFoldURL+req.body.filepath};Persist Security Info=False;`
  );
  const result = query(connection);
  result.then((val:any, err:any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(val);
      // console.log(val)
    }
  });
};

// 水动力模型计算接口
exports.Hydrodynamic = async (req: Request, res: Response) => {
  try {
    const body: [string[], string, string] = req.body;
    const paramKeys = body[0];
    const projKeys = body[1];
    const boundaryKeys = body[2];
    let keys: string[] = paramKeys;
    projKeys && keys.push(projKeys);
    boundaryKeys && keys.push(boundaryKeys);
    let meshFileName: string | undefined = undefined;
    let extent: number[] | undefined = undefined;
    // NOTE prisma 如何查找字段 where and select
    // NOTE JavaScript 中的 forEach不支持 promise 感知，也不支持 async 和await，所以不能在 forEach 使用 await 。 读一下 https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    // get data by key
    for (let index = 0; index < paramKeys.length; index++) {
      const key = paramKeys[index];
      const fileInfo = await prisma.data.findUnique({
        where: {
          id: key,
        },
        select: {
          data: true,
          type: true,
          extent: true,
        },
      });
      // NOTE 如何抛出错误
      if (!fileInfo) {
        res.status(200).json({ status: "failed", content: "the file is not exist" });
        return;
      } else;

      const src = dataFoldURL + fileInfo.data;
      const timeStamp = fileInfo.data.match(/(?<=\_)\d*/)?.toString();
      const dst =
        dataFoldURL +
        "/temp/model/hydrodynamics/model/" +
        path.basename(fileInfo.data).replace("_" + timeStamp!, "");
      fs.copyFile(src, dst, (err) => {
        if (err) throw err;
        else;
      });
      if (fileInfo.type === "mesh") {
        meshFileName = path.basename(fileInfo.data);
        extent = fileInfo.extent;
      } else;
    }
    if (!meshFileName) {
      res.status(200).json({ status: "failed", content: "the file is not exist" });
      return;
    } else;

    const petakID = crypto.randomUUID();
    const uvID = crypto.randomUUID();
    const uvetPath = "/temp/model/hydrodynamics/model/uvet.dat";
    await prisma.data.create({
      data: {
        data: uvetPath,
        id: petakID,
        style: "raster",
        temp: true,
        title: "uvet水深数据",
        type: "uvet",
        extent: extent!,
      },
    });
    await prisma.data.create({
      data: {
        data: uvetPath,
        id: uvID,
        style: "flow",
        temp: true,
        title: "uvet流场数据",
        type: "uvet",
        extent: extent!,
      },
    });

    const modelPath = dataFoldURL + "/temp/model/hydrodynamics/model/model.exe";
    const output = exec(`cd ${path.dirname(modelPath)} && ${modelPath}`, (err, stdout, stderr) => {
      if (stderr) res.status(200).json({ status: "wrong", content: "params is wrong" });
    });
    let currentCount = 0;
    let num: number;

    output.stdout?.on("data", async (chunk: string) => {
      console.log(chunk);
      if (chunk.includes("rnday")) {
        res.status(200).json({ status: "success", content: [uvID, petakID] });
        num = Number(chunk.match(/\d*\.\d{1,6}/)![0]) * 24;

        await prisma.data.updateMany({
          where: {
            id: uvID,
          },
          data: {
            progress: [0, 5 * Number(num) + 2],
          },
        });
        await prisma.data.updateMany({
          where: {
            id: petakID,
          },
          data: {
            progress: [0, 5 * Number(num) + 2],
          },
        });
      } else;
      if (chunk.includes("nt,it")) {
        currentCount = currentCount + 3;
        await prisma.data.updateMany({
          where: {
            id: uvID,
          },
          data: {
            progress: [currentCount, 5 * Number(num) + 2],
          },
        });
        await prisma.data.updateMany({
          where: {
            id: petakID,
          },
          data: {
            progress: [currentCount, 5 * Number(num) + 2],
          },
        });
      }
    });

    output.stdout?.on("end", async () => {
      if (!currentCount) {
        await prisma.data.deleteMany({
          where: {
            id: uvID,
          },
        });
        await prisma.data.deleteMany({
          where: {
            id: petakID,
          },
        });
        return;
      } else;

      // uvet2txt
      const txtTimeStamp = Date.now().toString();
      execSync(
        `conda activate gis && python ${
          path.resolve("./").split("\\").join("/") +
          "/utils/hydrodynamics/uvet2txt.py" +
          " " +
          `${dataFoldURL}/temp/model/hydrodynamics/model/uvet.dat` +
          " " +
          `${dataFoldURL}/temp/model/hydrodynamics/transform/uvet/txt` +
          " " +
          `${dataFoldURL}/temp/model/hydrodynamics/transform/mesh/${meshFileName!.replace(
            "gr3",
            "csv"
          )}` +
          " " +
          num +
          " " +
          txtTimeStamp
        }`
      );
      // uvet2description
      const descriptionTimeStamp = Date.now().toString();
      exec(
        `conda activate gis && python ${
          path.resolve("./").split("\\").join("/") +
          "/utils/hydrodynamics/uvet2description.py" +
          " " +
          `${dataFoldURL}/temp/model/hydrodynamics/transform/uvet/txt/description_${descriptionTimeStamp}.json` +
          " " +
          `/temp/model/hydrodynamics/transform/uvet/txt/` +
          " " +
          txtTimeStamp +
          " " +
          `/temp/model/hydrodynamics/transform/uvet/uv/` +
          " " +
          extent!.join(",") +
          " " +
          `../../mask/${meshFileName!.replace("gr3", "shp")}` +
          " " +
          num
        }`
      );
      // uvet2png;
      const pngTimeStamp = Date.now();
      await prisma.data.updateMany({
        where: {
          id: petakID,
        },
        data: {
          transform: [
            "/temp/model/hydrodynamics/transform/uvet/petak",
            num.toString(),
            pngTimeStamp.toString(),
          ],
        },
      });
      exec(
        `conda activate gis && python ${
          path.resolve("./").split("\\").join("/") +
          "/utils/hydrodynamics/uvet2png.py" +
          " " +
          `${dataFoldURL}/temp/model/hydrodynamics/transform/uvet/txt` +
          " " +
          txtTimeStamp +
          " " +
          `${dataFoldURL}/temp/model/hydrodynamics/transform/uvet/petak` +
          " " +
          pngTimeStamp +
          " " +
          `${dataFoldURL}/temp/model/hydrodynamics/transform/mask/${meshFileName!.replace(
            "gr3",
            "shp"
          )}` +
          " " +
          num
        }`,
        (err, stdout, stderr) => {
          console.log("uvet2png succeed");
        }
      );
      // uvet process
      await prisma.data.updateMany({
        where: {
          id: uvID,
        },
        data: {
          transform: [
            "/temp/model/hydrodynamics/transform/uvet/uv",
            num.toString(),
            txtTimeStamp.toString(),
          ],
        },
      });
      const processPath = resolve("./").split("\\").join("/") + "/utils/process/process.exe";
      const descriptionPath =
        dataFoldURL +
        "/temp/model/hydrodynamics/transform/uvet/txt/description_" +
        descriptionTimeStamp +
        ".json";
      // NOTE 不知道为什么, 加一个 setTImeout 就可以, 而且延时时间要多一点
      setTimeout(() => {
        const output = exec(processPath + " " + descriptionPath, (err, stdout, stderr) => {
          const renameFiles = async (timeStamp: string, num: number) => {
            const descriptionPath = `${dataFoldURL}/temp/model/hydrodynamics/transform/uvet/uv/flow_field_description.json`;
            for (let index = 0; index < num; index++) {
              const uvPath = `${dataFoldURL}/temp/model/hydrodynamics/transform/uvet/uv/uv_${index}.png`;
              const maskPath = `${dataFoldURL}/temp/model/hydrodynamics/transform/uvet/uv/mask_${index}.png`;
              const validPath = `${dataFoldURL}/temp/model/hydrodynamics/transform/uvet/uv/valid_${index}.png`;
              fs.rename(
                uvPath,
                uvPath.replace(`uv_${index}.png`, `uv_${timeStamp}_${index}.png`),
                () => {}
              );
              fs.rename(
                maskPath,
                maskPath.replace(`mask_${index}.png`, `mask_${timeStamp}_${index}.png`),
                () => {}
              );
              fs.rename(
                validPath,
                validPath.replace(`valid_${index}.png`, `valid_${timeStamp}_${index}.png`),
                () => {}
              );
            }
            console.log(descriptionPath);
            fs.rename(
              descriptionPath,
              descriptionPath.replace(
                `flow_field_description.json`,
                `flow_field_description_${timeStamp}.json`
              ),
              () => {}
            );
          };
          renameFiles(txtTimeStamp, num).then(async () => {
            currentCount = currentCount + 2;
            await prisma.data.updateMany({
              where: {
                id: uvID,
              },
              data: {
                progress: [currentCount, 5 * Number(num) + 2],
              },
            });
            await prisma.data.updateMany({
              where: {
                id: petakID,
              },
              data: {
                progress: [currentCount, 5 * Number(num) + 2],
              },
            });
          });
        });

        output.stdout?.on("data", async (chunk) => {
          console.log(chunk);
          if (chunk.includes("uvet")) {
            currentCount = currentCount + 1;
            await prisma.data.updateMany({
              where: {
                id: uvID,
              },
              data: {
                progress: [currentCount, 5 * Number(num) + 2],
              },
            });
            await prisma.data.updateMany({
              where: {
                id: petakID,
              },
              data: {
                progress: [currentCount, 5 * Number(num) + 2],
              },
            });
          } else;
        });
      }, 1000);
    });
  } catch (error) {
    res.status(200).send(error);
  }
};
