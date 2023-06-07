/*
 * @file: data_services.ts
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { dataFoldURL } from "../config/global_data";
import { resolve } from "path";
import { prisma } from "../utils/tools/prisma";
import { execa } from "execa";

const isVisualized = async (key: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: key,
    },
  });
  if (!info) {
    throw new Error(
      JSON.stringify({
        position: "visualization_service.ts-visualizeMesh()",
        message: "can't get error by key",
      })
    );
  } else;
  if (info.transformPath.length != 0) {
    return {
      status: "success",
      content: null,
    };
  } else;
  return {
    status: "fail",
    content: null,
  };
};

const visualizeMesh = async (key: string) => {
  const info = await prisma.data.findUnique({
    where: {
      id: key,
    },
  });
  if (!info) {
    throw new Error(
      JSON.stringify({
        position: "visualization_service.ts-visualizeMesh()",
        message: "can't get file by key",
      })
    );
  } else;
  if (info.transformPath.length != 0) {
    return {
      status: "success",
      content: null,
    };
  } else;
  let transform = [];
  const filePath = dataFoldURL + info.path;
  const csvPath = filePath
    .replace("/input", "/transform/mesh")
    .replace(".gr3", ".csv");
  const maskPath = filePath
    .replace("/input", "/transform/mesh")
    .replace(".gr3", ".shp");
  const pngPath = filePath
    .replace("/input", "/transform/mesh")
    .replace(".gr3", ".png");

  // generate csv from mesh
  await execa(
    `conda activate gis && python ${
      resolve("./").split("\\").join("/") +
      "/src/utils/water/mesh2csv.py" +
      " " +
      filePath +
      " " +
      csvPath
    }`,
    { shell: true, windowsHide: true }
  );
  // generate mask from csv
  await execa(
    `conda activate gis && python ${
      resolve("./").split("\\").join("/") +
      "/src/utils/water/mesh2mask.py" +
      " " +
      csvPath +
      " " +
      maskPath
    }`,
    { shell: true, windowsHide: true }
  );
  // generate png from csv and mask
  const { stdout } = await execa(
    `conda activate gis && python ${
      resolve("./").split("\\").join("/") +
      "/src/utils/water/mesh2png.py" +
      " " +
      csvPath +
      " " +
      pngPath +
      " " +
      maskPath
    }`,
    { shell: true, windowsHide: true }
  );
  transform.push(pngPath.split(dataFoldURL)[1]);
  // get extent of mesh
  const extent = stdout
    .toString()
    .trim()
    .replace("(", "")
    .replace(")", "")
    .split(",")
    .map((value) => Number(value));

  await prisma.data.update({
    where: {
      id: key,
    },
    data: {
      transformPath: transform,
      extent: extent,
    },
  });
  return {
    status: "success",
    content: null,
  };
};

const visualizePoint = async (pointKey: string, meshKey: string) => {
  // test point
  const pointInfo = await prisma.data.findUnique({
    where: {
      id: pointKey,
    },
  });
  if (!pointInfo) {
    throw new Error(
      JSON.stringify({
        position: "visualization_service.ts-visualizePoint()",
        message: "can't get file by key",
      })
    );
  } else;
  if (pointInfo.transformPath.length != 0) {
    return {
      status: "success",
      content: null,
    };
  } else;

  // test mesh
  const meshInfo = await prisma.data.findUnique({
    where: {
      id: meshKey,
    },
  });
  if (!meshInfo) {
    throw new Error(
      JSON.stringify({
        position: "visualization_service.ts-visualizePoint()",
        message: "can't get mesh by key",
      })
    );
  } else;
  if (meshInfo.transformPath.length === 0) {
    await visualizeMesh(meshKey);
  } else;
  // /project/1686057842038/1686057948133/transform/quality/in_node_1686139304346.json
  // dat2json
  let transform = [];
  const filePath = dataFoldURL + pointInfo.path;
  const meshPath =
    dataFoldURL +
    meshInfo.path.replace("/input", "/transform/mesh").replace(".gr3", ".csv");
  const dstPath = filePath
    .replace("/input", "/transform/quality")
    .replace(".dat", ".json");

  const { stdout } = await execa(
    `conda activate gis && python ${
      resolve("./").split("\\").join("/") +
      "/src/utils/water/dat2json.py" +
      " " +
      meshPath +
      " " +
      filePath +
      " " +
      dstPath
    }`,
    {
      windowsHide: true,
      shell: true,
    }
  );

  if (stdout === "fail") {
    throw new Error(
      JSON.stringify({
        position: "visualization_service.ts-visualizePoint()",
        message: "python code failed",
      })
    );
  } else;

  // update the record of database
  transform.push(dstPath.split(dataFoldURL)[1]);
  await prisma.data.update({
    where: {
      id: pointKey,
    },
    data: {
      transformPath: transform,
    },
  });

  return {
    status: "success",
    content: null,
  };
};

export const visualizationService = {
  isVisualized,
  visualizeMesh,
  visualizePoint,
};
