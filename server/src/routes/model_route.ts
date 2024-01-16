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

// EWE
modelRoute.post("/Import", modelController.Import);
modelRoute.post("/RunEcoPath", modelController.RunEcoPath);
modelRoute.post("/RunEcoSim", modelController.RunEcoSim);
modelRoute.post("/RunEcoSim_Switch", modelController.RunEcoSim_Switch);
modelRoute.post("/GroupPlot_Switch", modelController.GroupPlot_Switch);
modelRoute.post("/FleetPlot_Switch", modelController.FleetPlot_Switch);
modelRoute.post("/RunEcoSpace", modelController.RunEcoSpace);
modelRoute.post("/RunEcoSpace_Switch", modelController.RunEcoSpace_Switch);
modelRoute.post("/RunEcoSpace_SwitchMap", modelController.RunEcoSpace_SwitchMap);
// /api/model/water
modelRoute.get("/water", modelController.water);
