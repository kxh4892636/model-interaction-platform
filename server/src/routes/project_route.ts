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
import projectController from "../controllers/project_controller";

const router = express.Router();

// /project/case
router.get("/project", projectController.getProject);
// /project/list
router.get("/list", projectController.getProjectList);
// /project/action
router.post("/action", projectController.projectAction);

export default router;
