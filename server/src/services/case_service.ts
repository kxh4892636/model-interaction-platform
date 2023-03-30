/*
 * @file: case service
 * @Author: xiaohan kong
 * @Date: 2023-03-02
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-02
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { dataFoldURL } from "../config/global_data";

const prisma = new PrismaClient();

/**
 * delete all files in selected fold
 * @param folderPath the path of folder
 * @param filter the files (have suffix) that excluding delete eg. model.exe
 */
const deleteFolderFilesSync = (folderPath: string, filter: string[]) => {
  if (!fs.existsSync(folderPath)) {
    return;
  } else;

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    if (fs.statSync(filePath).isFile()) {
      if (!filter.includes(file)) fs.unlinkSync(filePath);
      else;
    } else {
      deleteFolderFilesSync(filePath, filter);
    }
  });
};

/**
 * copy selected folder to target path
 * @param source the source path of folder
 * @param target the target path of folder
 */
const copyFolderSync = (source: string, target: string) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  const files = fs.readdirSync(source);

  files.forEach(function (file) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    } else {
      copyFolderSync(sourcePath, targetPath);
    }
  });
};

/**
 * clear temp folder in data folder
 */
const clearTempFolder = async () => {
  try {
    deleteFolderFilesSync(dataFoldURL + "/temp", ["model.exe"]);
    await prisma.data.deleteMany({ where: { temp: true } });
    return { status: "success", content: "clear temp folder succeed" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return error.message;
    }
  }
};

/**
 * return the list of all cases
 * @returns caseList
 */
const getList = async () => {
  const data = await prisma.case.findMany();
  return data;
};

/**
 * return the info of selected case by id
 * @param id the id of case
 * @returns the info of case
 */
const getCase = async (id: string) => {
  const info = await prisma.case.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return "id is wrong";
  else;

  await prisma.case.update({
    where: {
      id: id as string,
    },
    data: {
      count: info?.count! + 1,
    },
  });

  return info;
};

/**
 * create case by the keys of data
 * @param keys the keys of data
 * @returns void
 */
const saveCase = async (
  title: string,
  imageKey: string,
  author: string,
  tags: string[],
  description: string,
  keys: string[]
) => {
  try {
    // create case record
    const timeStamp = Date.now();
    await prisma.case.create({
      data: {
        author: author,
        count: 0,
        description: description,
        id: crypto.randomUUID(),
        image: imageKey,
        time: new Date(timeStamp).toISOString(),
        title: title,
        data: keys,
        tags: tags,
      },
    });
    // update or create data record
    const allKeys = [...keys, imageKey];
    for (let index = 0; index < allKeys.length; index++) {
      const key = allKeys[index];
      const info = await prisma.data.findUnique({
        where: {
          id: key,
        },
      });

      if (!info) {
        throw new Error("the file is not exist");
      }

      // generate transform field
      let transform = info.transform;
      if (info.transform.length !== 0) {
        transform[0] = transform[0].replace("/temp/", "/case/");
      } else;

      // update record if data is input data
      if (info?.temp === true) {
        await prisma.data.update({
          where: {
            id: key,
          },
          data: {
            temp: false,
            data: info.data.replace("/temp/", "/case/"),
            transform: transform,
          },
        });
      } // create new record if data is case data
      else {
        await prisma.data.create({
          data: {
            temp: false,
            data: info.data.replace("/temp/", "/case/"),
            transform: transform,
            id: info.id,
            style: info.style,
            title: info.title,
            type: info.type,
            extent: info.extent,
            progress: info.progress,
          },
        });
      }
    }
    // copy temp input to case
    copyFolderSync(dataFoldURL + "/temp", dataFoldURL + "/case");
    deleteFolderFilesSync(dataFoldURL + "/temp", ["model.exe"]);
    console.log("save case succeed");

    return { status: "success", content: "save case succeed" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return error.message;
    }
  }
};

export default { getList, getCase, saveCase, clearTempFolder };
