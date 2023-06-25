/*
 * @file: project service
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-03
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import crypto from "crypto";
import { mkdir, readdir, unlink } from "fs/promises";
import { dataFoldURL } from "../config/global_data";
import { deleteFolder } from "../utils/tools/fs_extra";
import { prisma } from "../utils/tools/prisma";
import { datasetService } from "./dataset_service";

/**
 * create project
 * @param keys the keys of data
 * @returns void
 */
const createProject = async (title: string) => {
  // create project record
  const projectID = crypto.randomUUID();
  const timeStamp = Date.now().toString();
  const path = `/project/${timeStamp}`;
  await prisma.project.create({
    data: {
      id: projectID,
      image: "",
      title: title,
      data: [],
      position: ["116.3916", "39.9079", "11"],
      timeStamp: timeStamp,
      path: path,
      description: "",
      tags: [],
    },
  });
  await mkdir(dataFoldURL + path);
  return { status: "success", content: projectID };
};

/**
 * return the list of all projects
 * @returns caseList
 */
const getProjectList = async () => {
  const data = await prisma.project.findMany({
    select: {
      data: true,
      id: true,
      image: true,
      position: true,
      title: true,
      tags: true,
      description: true,
    },
    orderBy: {
      title: "asc",
    },
  });
  return { status: "success", content: data };
};

/**
 * return the info of selected project by id
 * @param projectID the id of project
 * @returns the info of project
 */
const getProject = async (projectID: string) => {
  // get the info of project
  const info = await prisma.project.findUnique({
    where: {
      id: projectID as string,
    },
    select: {
      id: true,
      image: true,
      data: true,
      title: true,
      position: true,
      description: true,
      tags: true,
    },
  });
  if (!info) throw new Error("can't find project by id");
  else;
  return { status: "success", content: info };
};

/**
 * generate the layers of project
 * @param projectID the id of project
 * @returns the layers of project
 */
const getProjectDataLayer = async (projectID: string) => {
  // get the info of project
  const info = await prisma.project.findUnique({
    where: {
      id: projectID as string,
    },
    select: {
      id: true,
    },
  });
  if (!info) throw new Error("can't find project by id");
  else;

  // get the datasets of project
  const datasetInfo = await prisma.dataset.findMany({
    where: {
      project: projectID,
    },
    select: {
      data: true,
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  // generate layer of project
  let layers: any[] = [];
  for (let index = 0; index < datasetInfo.length; index++) {
    const dataset = datasetInfo[index];
    layers[index] = {
      title: dataset.title,
      key: dataset.id,
      type: "text",
      layerStyle: "text",
      group: true,
      children: [],
      input:true,
    };
    const dataInfo = await prisma.data.findMany({
      where: {
        dataset: dataset.id,
      },
      orderBy: {
        title: "asc",
      },
    });
    dataInfo.every((value)=>{
      if(!value.input){
        layers[index] = {
          title: dataset.title,
          key: dataset.id,
          type: "text",
          layerStyle: "text",
          group: true,
          children: [],
          input:false,
        };
        return true
      }else;
      return false
    })
    dataInfo.forEach((data) => {
      (layers[index].children as object[]).push({
        title: (data.input ? "输入" : "输出") + " - " + data.title,
        key: data.id,
        type: data.type,
        layerStyle: data.style,
        group: false,
        input: data.input,
      });
    });
  }

  return { status: "success", content: layers };
};

/**
 * update the info of project
 * @param projectID the id of project
 * @param title the title of project
 * @param tags the tags of project
 * @param description the description of project
 * @param position the position of project
 * @param images the image of project
 */
const updateProjectInfo = async (
  projectID: string,
  title?: string,
  tags?: string[],
  description?: string,
  position?: string[],
  image?: string
) => {
  const projectInfo = await prisma.project.findUnique({
    where: { id: projectID },
  });
  if (!projectInfo) throw new Error("can't find project by id");
  else;
  if (image && projectInfo.image) {
    const imageInfo = await prisma.data.findUnique({
      where: {
        id: projectInfo.image,
      },
    });
    if (!imageInfo) return;
    else;
    await prisma.data.delete({
      where: {
        id: projectInfo.image,
      },
    });
    await unlink(dataFoldURL + imageInfo!.path);
  } else;

  await prisma.project.update({
    where: { id: projectID },
    data: {
      title: title || projectInfo.title,
      tags: tags || projectInfo.tags,
      description: description || projectInfo.description,
      position: position || projectInfo.position,
      image: image || projectInfo.image,
    },
  });
  return { status: "success", content: "update success" };
};

/**
 * delete project, case of project and data of case
 * @param id the id of project
 */
const deleteProject = async (projectID: string) => {
  const info = await prisma.project.findUnique({ where: { id: projectID } });
  if (!info) {
    throw new Error("can't find project by id");
  } else;
  // delete the image
  const imageKey = info.image;
  if (imageKey) {
    const imageInfo = await prisma.data.findUnique({ where: { id: imageKey } });
    const imagePath = imageInfo!.path;
    await unlink(dataFoldURL + imagePath);
    await prisma.data.delete({ where: { id: imageKey } });
  } else;
  // delete the dataset
  const datasetIDs = info.data;
  for (let index = 0; index < datasetIDs.length; index++) {
    const datasetID = datasetIDs[index];
    await datasetService.deleteDataset(datasetID);
  }
  // delete the record of project
  await prisma.project.delete({ where: { id: projectID } });
  console.log(await readdir(dataFoldURL + info.path));
  // delete the folder of project
  await deleteFolder(dataFoldURL + info.path);
  return { status: "success", content: "delete project succeed" };
};

export const projectService = {
  createProject,
  getProjectList,
  getProject,
  getProjectDataLayer,
  updateProjectInfo,
  deleteProject,
};
