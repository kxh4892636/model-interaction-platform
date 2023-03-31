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
import {
  copyFolderSync,
  deleteFolderFilesSync,
  deleteSelectFilesInFolderSync,
} from "../utils/tools/fs_action";
import { dataFoldURL } from "../config/global_data";

const prisma = new PrismaClient();

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
        description: description ? description : title,
        id: crypto.randomUUID(),
        image: imageKey ? imageKey : "",
        time: new Date(timeStamp).toISOString(),
        title: title,
        data: keys,
        tags: tags,
      },
    });
    // update or create data record
    const allKeys = imageKey ? [...keys, imageKey] : keys;
    for (let index = 0; index < allKeys.length; index++) {
      const key = allKeys[index];
      const info = await prisma.data.findUnique({
        where: {
          id: key,
        },
      });

      if (!info) {
        return { status: "fail", content: "the file is not exist" };
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
      } // increase count if data is case data
      else {
        const info = await prisma.data.findUnique({
          where: { id: key },
          select: { count: true },
        });
        const count = info!.count;
        await prisma.data.update({
          where: { id: key },
          data: {
            count: count + 1,
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

/**
 * delete case and its data
 * @param id the id of case
 */
const deleteCase = async (id: string) => {
  const info = await prisma.case.findUnique({ where: { id: id } });
  if (!info) {
    return { status: "fail", content: "can't find case by id" };
  }
  const keys = [...info.data, info.image];
  let timeStamps: string[] = [];
  let filterKeys: string[] = [];

  // NOTE 不要在循环中修改被循环数组
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const dataInfo = await prisma.data.findUnique({ where: { id: key } });
    const timeStamp = dataInfo!.data.match(/(?<=\_)\d*(?=\.)/)?.toString();
    const count = dataInfo!.count;
    console.log(count);
    console.log(key);

    if (count > 1) {
      await prisma.data.update({ where: { id: key }, data: { count: count - 1 } });
      filterKeys.push(key);
    } else {
      timeStamps.push(timeStamp!);
    }
  }
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    await prisma.data.delete({ where: { id: key } });
  }
  await prisma.case.delete({ where: { id: id } });
  deleteSelectFilesInFolderSync(dataFoldURL + "/case", timeStamps);

  return { status: "success", content: "delete case succeed" };
};

export default { getList, getCase, saveCase, deleteCase };
