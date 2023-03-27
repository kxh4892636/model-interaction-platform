import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { dataFoldURL } from "../../config/global_data";
import fs from "fs";
import path, { resolve } from "path";
import crypto from "crypto";
import { exec, execSync } from "child_process";

const prisma = new PrismaClient();

const runHydrodynamics = async (req: Request, res: Response) => {
  try {
    const keys: [string[], string | undefined, string | undefined] = req.body;
    const paramKeys = keys[0]; // the keys of params
    const projKey = keys[1]; // the key of proj
    const boundaryKey = keys[2]; // the keys of boundary
    const meshInfo: {
      meshFileName: string | null;
      extent: number[] | null;
    } = { meshFileName: null, extent: null }; // store info of mesh

    // copy input files to model fold and return the fileName and extent of mesh
    await copyInputFilesToModelFold(meshInfo, paramKeys, res, projKey, boundaryKey);
    if (meshInfo.meshFileName === null) {
      res.status(200).json({ status: "failed", content: "params is wrong" });
    } else;

    // create the record of result
    const uvetPath = "/temp/model/hydrodynamics/model/uvet.dat";
    const [uvID, petakID] = await createResultRecord(uvetPath, meshInfo.extent!);

    // run model
    const modelPath = dataFoldURL + "/temp/model/hydrodynamics/model/model.exe";
    const output = exec(`cd ${path.dirname(modelPath)} && ${modelPath}`, (err, stdout, stderr) => {
      if (stderr) res.status(200).json({ status: "wrong", content: "params is wrong" });
    });
    let num: number; // the total number of files
    let currentCount = 0; // the current number of files that have been calculated

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
            transform: ["/temp/model/hydrodynamics/transform/uvet/uv", num.toString()],
            progress: [0, 4 * Number(num) + 4],
          },
        });
        await prisma.data.updateMany({
          where: {
            id: petakID,
          },
          data: {
            transform: ["/temp/model/hydrodynamics/transform/uvet/petak", num.toString()],
            progress: [0, 4 * Number(num) + 4],
          },
        });
      } else;
      if (chunk.includes("nt,it")) {
        currentCount = currentCount + 2;
        await prisma.data.updateMany({
          where: {
            id: uvID,
          },
          data: {
            progress: [currentCount, 4 * Number(num) + 4],
          },
        });
        await prisma.data.updateMany({
          where: {
            id: petakID,
          },
          data: {
            progress: [currentCount, 4 * Number(num) + 4],
          },
        });
      }
    });
  } catch (error) {
    res.status(200).send(error);
  }
};

const copyInputFilesToModelFold = async (
  meshInfo: {
    meshFileName: string | null;
    extent: number[] | null;
  },
  paramKeys: string[],
  res: Response,
  projKey: string | undefined,
  boundaryKey: string | undefined
) => {
  let keys = paramKeys;
  projKey && keys.push(projKey);
  boundaryKey && keys.push(boundaryKey);

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
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
    // Return if the file is not exist
    if (!fileInfo) {
      res.status(200).json({ status: "failed", content: "The file is not exist" });
      return;
    } else;
    // Copy file to selected fold
    const src = dataFoldURL + fileInfo.data;
    const timeStamp = fileInfo.data.match(/(?<=\_)\d*/)?.toString();
    const dst =
      dataFoldURL +
      "/temp/model/hydrodynamics/model/" +
      path.basename(fileInfo.data).replace("_" + timeStamp!, "");
    fs.copyFile(src, dst, (err) => {
      if (err) {
        res.status(200).json({ status: "failed", content: "File copy failed" });
        return;
      } else;
    });
    // store the fileName and extent of mesh
    if (fileInfo.type === "mesh") {
      meshInfo.meshFileName = path.basename(fileInfo.data);
      meshInfo.extent = fileInfo.extent;
    } else;
  }
};

const createResultRecord = async (uvetPath: string, extent: number[]) => {
  const petakID = crypto.randomUUID();
  const uvID = crypto.randomUUID();
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

  return [petakID, uvID];
};

export { runHydrodynamics };
