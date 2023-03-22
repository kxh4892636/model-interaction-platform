import fs from "fs";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { dataFoldURL } from "../../config/global_data";
import { exec, execSync } from "child_process";
import { resolve } from "path";

const prisma = new PrismaClient();

const getList = async () => {
  const data = await prisma.data.findMany();
  return data;
};

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

const getUVET = async (id: string, type: string, currentImage: number) => {
  const info = await prisma.data.findUnique({
    where: {
      id: id as string,
    },
  });
  if (!info) return "can't find data by id";
  else if (type === "description") return dataFoldURL + info.transform[0] + "/description.json";
  else return dataFoldURL + info.transform[0] + `/${type}_${currentImage}.png`;
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
  // get type and style of data
  const output = execSync(
    `conda activate gis && python ${
      resolve("./").split("\\").join("/") + "/utils/get_data_type_and_style.py"
    } ${filePath}`
  );
  const [type, style] = output.toString().trimEnd().split(",");
  let transform: string[] = [];
  let extent: number[] = [];

  // generate transform filed
  if (type === "mesh") {
    const fileName = file.filename.split(".")[0];
    const csvPath = filePath
      .replace(file.filename, `${fileName}.csv`)
      .replace("\\temp\\input", "\\temp\\model\\hydrodynamics\\transform\\mesh");
    const maskPath = filePath
      .replace(file.filename, `${fileName}.shp`)
      .replace("\\temp\\input", "\\temp\\model\\hydrodynamics\\transform\\mask");
    const pngPath = filePath
      .replace(file.filename, `${fileName}.png`)
      .replace("\\temp\\input", "\\temp\\model\\hydrodynamics\\transform\\mesh");
    transform.push(pngPath.split("\\").join("/").split(dataFoldURL)[1]);
    // NOTE cmd &&
    // generate csv from mesh
    execSync(
      `conda activate gis && python ${
        resolve("./").split("\\").join("/") +
        "/utils/hydrodynamics/mesh2csv.py" +
        " " +
        filePath +
        " " +
        csvPath
      }`
    );
    // generate mask from csv
    execSync(
      `conda activate gis && python ${
        resolve("./").split("\\").join("/") +
        "/utils/hydrodynamics/mesh2mask.py" +
        " " +
        csvPath +
        " " +
        maskPath
      }`
    );
    // generate png from csv and mask
    const output = execSync(
      `conda activate gis && python ${
        resolve("./").split("\\").join("/") +
        "/utils/hydrodynamics/mesh2png.py" +
        " " +
        csvPath +
        " " +
        pngPath +
        " " +
        maskPath
      }`
    );
    // get extent of mesh
    extent = output
      .toString()
      .trim()
      .replace("(", "")
      .replace(")", "")
      .split(",")
      .map((value) => Number(value));
  } else if (type === "uvet") {
    // TODO 以后写
  }

  // write data into database
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
      progress: [1, 1],
    },
  });

  return id;
};

export default {
  getList,
  getDetail,
  getImage,
  getJSON,
  getMesh,
  getShp,
  getUVET,
  getText,
  uploadData,
};
