/*
 * @file: dataset_route.ts
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import express from "express";
import { datasetController } from "../controllers/dataset_controller";

export const datasetRoute = express.Router();

// /api/dataset/list
datasetRoute.get("/list", datasetController.getDatasetList);
// /api/dataset/action
datasetRoute.post("/action", datasetController.datasetAction);
