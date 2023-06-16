/*
 * @file: /project controller
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-03
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { Request, Response } from "express";
import { projectService } from "../services/project_service";

// get project list
const getProjectList = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await projectService.getProjectList());
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};
// get data of project by key
const getProject = async (req: Request, res: Response) => {
  try {
    const type = req.query.action;
    if (type === "data") {
      res
        .status(200)
        .json(await projectService.getProject(req.query.id as string));
    } else if (type === "layer") {
      res
        .status(200)
        .json(await projectService.getProjectDataLayer(req.query.id as string));
    } else {
      throw new Error("don't have this action");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
    console.log(error);
  }
};

const projectAction = async (req: Request, res: Response) => {
  try {
    const type = req.body.action;
    if (type === "create") {
      res.status(200).json(await projectService.createProject(req.body.title));
    } else if (type === "delete") {
      res.status(200).json(await projectService.deleteProject(req.body.id));
    } else if (type === "updateInfo") {
      res
        .status(200)
        .json(
          await projectService.updateProjectInfo(
            req.body.id,
            req.body.title,
            req.body.tags,
            req.body.description,
            req.body.position,
            req.body.image
          )
        );
    } else {
      throw new Error("don't have this action");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
    console.log(error);
  }
};

export const projectController = { getProject, getProjectList, projectAction };
