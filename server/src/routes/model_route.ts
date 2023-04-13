/*
 * @file: /api/model route
 * @Author: xiaohan kong
 * @Date: 2023-04-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-10
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import express from "express";
import { modelController } from "../controllers/model_controller";
export const modelRoute = express.Router();

// /api/model/R_test2
modelRoute.post("/R_test2", modelController.R_Test2);
// /api/model/R_test3
modelRoute.post("/R_test3", modelController.R_Test3);
// /api/model/water
modelRoute.post("/water", modelController.water);
