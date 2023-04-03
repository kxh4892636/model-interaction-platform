/*
 * @file: project service
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-03
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { copyFileSync, unlinkSync } from "fs";
import { dataFoldURL } from "../config/global_data";
import caseService from "./case_service";

const prisma = new PrismaClient();

/**
 * return the list of all projects
 * @returns caseList
 */
const getProjectList = async () => {
  const data = await prisma.project.findMany({
    orderBy: {
      count: "desc",
    },
  });
  return { status: "success", content: data };
};

/**
 * return the info of selected project by id
 * @param id the id of project
 * @returns the info of project
 */
const getProject = async (id: string) => {
  const info = await prisma.project.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return { status: "fail", content: "can't find project by id" };
  else;

  await prisma.project.update({
    where: {
      id: id as string,
    },
    data: {
      count: info.count! + 1,
    },
  });

  return { status: "success", content: info };
};

/**
 * create project
 * @param keys the keys of data
 * @returns void
 */
const saveProject = async (
  title: string,
  imageKey: string,
  author: string,
  keys: string[],
  position: string[]
) => {
  // create project record
  const projectID = crypto.randomUUID();
  await prisma.project.create({
    data: {
      author: author,
      count: 0,
      description: title,
      id: projectID,
      image: imageKey ? imageKey : "",
      title: title,
      data: keys,
      position: position.map((value) => value.toString()),
    },
  });
  // copy image
  if (imageKey) {
    const info = await prisma.data.findUnique({
      where: {
        id: imageKey,
      },
    });
    await prisma.data.update({
      where: {
        id: imageKey,
      },
      data: {
        temp: false,
        data: info!.data.replace("/temp/", "/case/"),
      },
    });
    const src = dataFoldURL + info!.data;
    const dst = src.replace("/temp/", "/case/");
    copyFileSync(src, dst);
  } else;
  return { status: "success", content: projectID };
};

/**
 * delete project, case of project and data of case
 * @param id the id of project
 */
const deleteProject = async (id: string) => {
  const info = await prisma.project.findUnique({ where: { id: id } });

  if (!info) {
    throw new Error("can't find project by id");
  }
  const imageKey = info.image;
  if (imageKey) {
    const imageInfo = await prisma.data.findUnique({ where: { id: imageKey } });
    const imagePath = imageInfo!.data;
    unlinkSync(dataFoldURL + imagePath);
    await prisma.data.delete({ where: { id: imageKey } });
  } else;
  const caseKeys = info.data;
  for (let index = 0; index < caseKeys.length; index++) {
    const key = caseKeys[index];
    await caseService.deleteCase(key);
  }
  await prisma.project.delete({ where: { id: id } });
  return { status: "success", content: "delete project succeed" };
};

export default { getProjectList, getProject, saveProject, deleteProject };
