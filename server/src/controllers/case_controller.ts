/*
 * @file: /case controller
 * @Author: xiaohan kong
 * @Date: 2023-03-02
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-02
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { Request, Response } from "express";
import caseService from "../services/case_service";

// get case list
const getList = async (req: Request, res: Response) => {
  try {
    const projectID = req.query.id as string;
    res.status(200).json(await caseService.getList(projectID));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};
// get data of case by key
const getCase = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await caseService.getCase(req.query.id as string));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};

const caseAction = async (req: Request, res: Response) => {
  try {
    const type = req.body.action;
    if (type === "save") {
      res
        .status(200)
        .json(
          await caseService.saveCase(
            req.body.title,
            req.body.imageKey,
            req.body.author,
            req.body.tags,
            req.body.description,
            req.body.keys,
            req.body.projectKey
          )
        );
    } else if (type === "delete") {
      res.status(200).json(await caseService.deleteCase(req.body.id));
    } else {
      throw new Error("don't have this action");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};

export default { getList, getCase, caseAction };
