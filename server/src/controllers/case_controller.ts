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
    res.status(200).json(await caseService.getList());
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// get data of case by key
const getCase = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await caseService.getCase(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export default { getList, getCase };
