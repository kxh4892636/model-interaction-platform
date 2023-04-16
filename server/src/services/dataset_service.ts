/*
 * @file: dataset service
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import crypto from "crypto";
import { copyFolder, deleteFolder } from "../utils/tools/fs_extra";
import { dataFoldURL } from "../config/global_data";
import { prisma } from "../utils/tools/prisma";

/**
 * return the list of all dataset
 * @returns the array of dataset
 */
const getList = async (projectID: string) => {
  if (!projectID) throw new Error("id is not provided");
  else;
  const data = await prisma.dataset.findMany({
    where: {
      project: projectID,
    },
    select: {
      id: true,
      data: true,
      title: true,
    },
  });
};

/**
 *
 * @param title the title of dataset
 * @param projectID the project id of dataset
 * @returns the id of dataset
 */
const addDataset = async (title: string, projectID: string) => {
  const id = crypto.randomUUID();
  const timeStamp = Date.now().toString();
  const projectInfo = await prisma.project.findUnique({
    where: { id: projectID },
  });
  const path = projectInfo!.path + `/${timeStamp}`;
  await copyFolder(dataFoldURL + "/template/dataset_template", dataFoldURL + path);
  await prisma.dataset.create({
    data: {
      id: id,
      project: projectID,
      timeStamp: timeStamp,
      title: title,
      data: [],
      path: path,
    },
  });
  await prisma.project.update({
    where: { id: projectID },
    data: {
      data: [...projectInfo!.data, id],
    },
  });
  return { status: "success", content: id };
};

/**
 * rename dataset
 * @param id the id of dataset
 * @param title the rename title of dataset
 * @returns
 */
const renameDataset = async (id: string, title: string) => {
  await prisma.dataset.update({
    where: {
      id: id,
    },
    data: {
      title: title,
    },
  });
  return { status: "success", content: "update succeed" };
};

const deleteDataset = async (datasetID: string) => {
  const datasetInfo = await prisma.dataset.findUnique({ where: { id: datasetID } });
  if (!datasetInfo) throw new Error("can't find data by id");
  else;
  const path = dataFoldURL + datasetInfo.path;
  // delete origin file path
  deleteFolder(path);
  // update project
  const projectInfo = await prisma.project.findUnique({
    where: { id: datasetInfo!.project },
  });
  await prisma.project.update({
    where: { id: datasetInfo!.project },
    data: {
      data: projectInfo!.data.filter((value) => value !== datasetID),
    },
  });
  // delete the record
  await prisma.data.deleteMany({ where: { dataset: datasetID } });
  await prisma.dataset.delete({ where: { id: datasetID } });
  return { status: "success", content: "delete succeed" };
};

export const datasetService = { getList, addDataset, renameDataset, deleteDataset };
