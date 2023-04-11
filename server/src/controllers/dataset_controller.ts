/*
 * @file: /api/dataset controller
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Request, Response } from "express";
import { datasetService } from "../services/dataset_service";

// get the list of dataset
const getDatasetList = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await datasetService.getList(req.query.projectKey as string));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
  }
};

// actions of dataset
const datasetAction = async (req: Request, res: Response) => {
  try {
    const type = req.body.action;
    if (type === "create") {
      res
        .status(200)
        .json(
          await datasetService.addDataset(req.body.title as string, req.body.projectKey as string)
        );
    } else if (type === "rename") {
      res
        .status(200)
        .json(
          await datasetService.renameDataset(req.body.datasetID as string, req.body.title as string)
        );
    } else if (type === "delete") {
      res.status(200).json(await datasetService.deleteDataset(req.body.datasetID as string));
    } else {
      throw new Error("don't have this action");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};

export const datasetController = { getDatasetList, datasetAction };
