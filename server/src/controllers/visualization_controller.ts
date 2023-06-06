/*
 * @file: /api/visualization controller
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Response, Request } from "express";
import { visualizationService } from "../services/visualization_service";

const isVisualized = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const key = query.key;
    res
      .status(200)
      .json(await visualizationService.visualizeMesh(key as string));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};

const visualizeMesh = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const key = body.key;
    res
      .status(200)
      .json(await visualizationService.visualizeMesh(key as string));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};

export const visualizationController = { isVisualized, visualizeMesh };
