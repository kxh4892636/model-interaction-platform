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
import projectServices from "../services/project_services";

// get project list
const getProjectList = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await projectServices.getProjectList());
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};
// get data of project by key
const getProject = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await projectServices.getProject(req.query.id as string));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};

const projectAction = async (req: Request, res: Response) => {
  try {
    const type = req.body.action;
    if (type === "save") {
      res
        .status(200)
        .json(
          await projectServices.saveProject(
            req.body.title,
            req.body.imageKey,
            req.body.author,
            req.body.keys,
            req.body.position
          )
        );
    } else if (type === "delete") {
      res.status(200).json(await projectServices.deleteProject(req.body.id));
    } else {
      throw new Error("don't have this action");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};

export default { getProject, getProjectList, projectAction };
