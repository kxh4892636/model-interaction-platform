/*
 * @file: /case route
 * @Author: xiaohan kong
 * @Date: 2023-03-02
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-02
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import express from "express";
import caseController from "../controllers/case_controller";

const router = express.Router();

// /case/case
router.get("/case", caseController.getCase);
// /case/list
router.get("/list", caseController.getList);
// /case/action
router.post("/action", caseController.caseAction);

export default router;
