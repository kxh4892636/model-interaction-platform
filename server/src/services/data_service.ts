import { Response, Request, request } from "express";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { dataFoldURL, condaEnv } from "../../config/global_data";
import { execSync } from "child_process";
import { resolve } from "path";

const prisma = new PrismaClient();

const getDetail = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return "can't find data by id";
  else;

  return info;
};

const getJSON = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return "can't find data by id";

  const filePath = dataFoldURL + info.data;
  const buffer = fs.readFileSync(filePath).toString();
  const json = JSON.parse(buffer);

  return json;
};

const getMesh = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return "can't find data by id";

  const filePath = dataFoldURL + info.transform[0];

  return filePath;
};

const getUVET = async (id: string, currentImage: number) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return "can't find data by id";

  const filePath =
    dataFoldURL +
    info.transform[0].replace(
      "uvet_petak_transform.png",
      `uvet_petak_transform_${currentImage}.png`
    );

  return filePath;
};

const getImage = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return "can't find data by id";

  const filePath = dataFoldURL + info.data;

  return filePath;
};

const getShp = async (id: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return "can't find data by id";

  const filePath = dataFoldURL + info.transform[0];
  const buffer = fs.readFileSync(filePath).toString();
  const json = JSON.parse(buffer);

  return json;
};

const getText = async () => {
  return "need not to send";
};

const uploadData = async (file: Express.Multer.File) => {
  if (!file) return "upload failed";
  else;

  const filePath: string = file.path;
  const id = crypto.randomUUID();
  const output = execSync(
    `python ${
      resolve("./").split("\\").join("/") + "/utils/python/get_data_type_and_style.py"
    } ${filePath}`
  );
  const [type, style] = output.toString().trimEnd().split(",");
  let transform: string[] = [];
  let extent: number[] = [];

  if (type === "mesh") {
    const fileName = file.filename.split(".")[0];
    const transformPath = filePath
      .replace(file.filename, `${fileName}_transform.png`)
      .replace("\\temp\\input", "\\temp\\transform");

    transform.push(transformPath.split("\\").join("/").split(dataFoldURL)[1]);
    const output = execSync(
      `python ${
        resolve("./").split("\\").join("/") +
        "/utils/python/mesh_transform.py" +
        " " +
        filePath +
        " " +
        transformPath
      }`
    );

    extent = output
      .toString()
      .trim()
      .replace("(", "")
      .replace(")", "")
      .split(",")
      .map((value) => Number(value));
  } else if (type === "shp") {
    // TODO 以后写
  } else if (type === "uvet") {
    // TODO 以后写
  }

  await prisma.data.create({
    data: {
      data: filePath.split("\\").join("/").split(dataFoldURL)[1],
      id: id,
      temp: true,
      title: file.filename.split(".")[0],
      type: type,
      style: style,
      extent: extent,
      transform: transform,
    },
  });

  return id;
};

export default { getDetail, getImage, getJSON, getMesh, getShp, getUVET, getText, uploadData };
