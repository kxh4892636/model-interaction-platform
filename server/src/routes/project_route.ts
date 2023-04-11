/*
 * @file: /project route
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-03
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import express from "express";
import { projectController } from "../controllers/project_controller";

export const projectRoute = express.Router();

// /api/project/project
projectRoute.get("/project", projectController.getProject);
// /api/project/list
projectRoute.get("/list", projectController.getProjectList);
// /api/project/action
projectRoute.post("/action", projectController.projectAction);
