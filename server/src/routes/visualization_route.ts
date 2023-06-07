/*
 * @file: visualization_route.ts
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import express from "express";
import { visualizationController } from "../controllers/visualization_controller";

export const visualizationRoute = express.Router();

// /api/visualization/state
visualizationRoute.get("/state", visualizationController.isVisualized);
// /api/visualization/mesh
visualizationRoute.post("/mesh", visualizationController.visualizeMesh);
// /api/visualization/point
visualizationRoute.post("/point", visualizationController.visualizePoint);
