/*
 * @file: data_services.ts
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import crypto from "crypto";
import { dataFoldURL } from "../config/global_data";
import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { deleteSelectFilesInFolderSync } from "../utils/tools/fs_action";
import { lstatSync, readFileSync, unlinkSync } from "fs";
import { prisma } from "../utils/tools/prisma";

const getDetail = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
    select: {
      id: true,
      title: true,
      style: true,
      type: true,
      extent: true,
      progress: true,
      dataset: true,
      input: true,
      transformPath: true,
    },
  });
  if (!info) throw new Error("can't find data by id");
  else;
  let transformNum = info.transformPath.length.toString();
  if (Number(transformNum) > 1) transformNum = info.transformPath[1];
  return {
    status: "success",
    content: {
      id: info.id,
      title: info.title,
      style: info.style,
      type: info.type,
      extent: info.extent,
      progress: info.progress,
      dataset: info.dataset,
      input: info.input,
      transformNum: transformNum,
    },
  };
};

const getJSON = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });
  if (!info) throw new Error("can't find data by id");
  const filePath = dataFoldURL + info.path;
  const buffer = readFileSync(filePath).toString();
  const json = JSON.parse(buffer);
  return { status: "success", content: json };
};

const getMesh = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });
  if (!info) throw new Error("can't find data by id");
  const filePath = dataFoldURL + info.transformPath[0];
  return { status: "success", content: filePath };
};

const getUVET = async (id: string, type: string, currentImage: number) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });
  let content = "";
  if (!info) throw new Error("can't find data by id");
  else if (type === "description")
    content =
      dataFoldURL + info.transformPath[0] + `/flow_field_description_${info.transformPath[2]}.json`;
  else
    content =
      dataFoldURL + info.transformPath[0] + `/${type}_${info.transformPath[2]}_${currentImage}.png`;
  return { status: "success", content: content };
};

const getImage = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });
  if (!info) throw new Error("can't find data by id");
  else;
  const filePath = dataFoldURL + info.path;
  return { status: "success", content: filePath };
};

const getText = async () => {
  return { status: "success", content: "need not to send" };
};

/**
 * upload file to server
 * @param file upload file
 * @returns the id of updata file
 */
const uploadData = async (file: Express.Multer.File, datasetID: string) => {
  if (!file) throw new Error("upload failed");
  else;
  const filePath: string = file.path;
  const id = crypto.randomUUID();
  if (datasetID === "assets") {
    await prisma.data.create({
      data: {
        path: filePath.split("\\").join("/").split(dataFoldURL)[1],
        id: id,
        title: file.filename.split(/_\d+/)[0],
        type: "text",
        style: "text",
        extent: [],
        progress: ["1", "1"],
        dataset: datasetID,
        input: true,
        timeStamp: "",
        transformPath: [],
      },
    });
    return id;
  } else;
  // get type and style of data
  const output = execSync(
    `conda activate gis && python ${
      resolve("./").split("\\").join("/") + "/src/utils/tools/get_data_type_and_style.py"
    } ${filePath}`,
    { windowsHide: true }
  );
  const [type, style] = output.toString().trimEnd().split(",");
  let transform: string[] = [];
  let extent: number[] = [];
  // generate transform filed
  if (type === "mesh") {
    const fileName = file.filename.split(".")[0];
    const csvPath = filePath
      .replace(file.filename, `${fileName}.csv`)
      .replace(/(?<=\d*)\\input/, "\\transform\\mesh");
    const maskPath = filePath
      .replace(file.filename, `${fileName}.shp`)
      .replace(/(?<=\d*)\\input/, "\\transform\\mesh");
    const pngPath = filePath
      .replace(file.filename, `${fileName}.png`)
      .replace(/(?<=\d*)\\input/, "\\transform\\mesh");
    transform.push(pngPath.split("\\").join("/").split(dataFoldURL)[1]);
    // generate csv from mesh
    execSync(
      `conda activate gis && python ${
        resolve("./").split("\\").join("/") +
        "/src/utils/hydrodynamics/mesh2csv.py" +
        " " +
        filePath +
        " " +
        csvPath
      }`,
      { windowsHide: true }
    );
    // generate mask from csv
    execSync(
      `conda activate gis && python ${
        resolve("./").split("\\").join("/") +
        "/src/utils/hydrodynamics/mesh2mask.py" +
        " " +
        csvPath +
        " " +
        maskPath
      }`,
      { windowsHide: true }
    );
    // generate png from csv and mask
    const output = execSync(
      `conda activate gis && python ${
        resolve("./").split("\\").join("/") +
        "/src/utils/hydrodynamics/mesh2png.py" +
        " " +
        csvPath +
        " " +
        pngPath +
        " " +
        maskPath
      }`,
      { windowsHide: true }
    );
    // get extent of mesh
    extent = output
      .toString()
      .trim()
      .replace("(", "")
      .replace(")", "")
      .split(",")
      .map((value) => Number(value));
  } else {
  }
  // write data into database
  const timeStamp = filePath.match(/(?<=\_)\d*(?=\.)/)?.toString();
  await prisma.data.create({
    data: {
      path: filePath.split("\\").join("/").split(dataFoldURL)[1],
      id: id,
      title: file.filename.split(/_\d+/)[0],
      type: type,
      style: style,
      extent: extent,
      progress: ["1", "1"],
      dataset: datasetID,
      input: true,
      timeStamp: timeStamp ? timeStamp : "",
      transformPath: transform,
    },
  });
  // update dataset
  const datasetInfo = await prisma.dataset.findUnique({
    where: { id: datasetID },
    select: {
      data: true,
    },
  });
  await prisma.dataset.update({
    where: { id: datasetID },
    data: {
      data: [...datasetInfo!.data, id],
    },
  });
  return id;
};

/**
 * rename data
 * @param id the id of data
 * @param title the title of rename
 * @returns
 */
const renameData = async (id: string, title: string) => {
  await prisma.data.update({
    where: {
      id: id,
    },
    data: {
      title: title,
    },
  });
  return { status: "success", content: "update succeed" };
};

const deleteData = async (dataID: string) => {
  const dataInfo = await prisma.data.findUnique({ where: { id: dataID } });
  if (!dataInfo) throw new Error("can't find data by id");
  else;
  const path = dataFoldURL + dataInfo.path;
  const transformPath = dataFoldURL + dataInfo.transformPath[0];
  const timeStamp = dataInfo.timeStamp;
  // delete the record
  await prisma.data.delete({ where: { id: dataID } });
  // delete origin file path
  unlinkSync(path);
  // delete transform file path
  if (lstatSync(transformPath).isFile()) {
    console.log(dirname(transformPath), timeStamp);
    deleteSelectFilesInFolderSync(dirname(transformPath), [timeStamp]);
  } else {
    deleteSelectFilesInFolderSync(transformPath, [timeStamp]);
  }
  return { status: "success", content: "delete succeed" };
};

export const dataService = {
  uploadData,
  renameData,
  deleteData,
  getDetail,
  getImage,
  getJSON,
  getMesh,
  getText,
  getUVET,
};
