/*
 * @file: /api/model controller
 * @Author: xiaohan kong
 * @Date: 2023-04-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-10
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Request, Response } from "express";
import { modelService } from "../services/model_service";

//
const R_Test2 = async (req: Request, res: Response) => {
  try {
    console.log(await modelService.R_test2(req, res));

    res.status(200).send(await modelService.R_test2(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
  }
};

const R_Test3 = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await modelService.R_test3(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
  }
};

const hydrodynamics = async (req: Request, res: Response) => {
  try {
    const type = req.body.action;
    if (type === "run") {
      const result = await modelService.runHydrodynamics(
        req.body.paramKeys as string[],
        req.body.projKey as string,
        req.body.title as string,
        req.body.projectID as string,
        res
      );
    } else if (type === "stop") {
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
  }
};

export const modelController = { R_Test2, R_Test3, hydrodynamics };

// DELETE FROM public.ecopathcatch
// DELETE FROM public.ecopathdiet
// DELETE FROM public.ecopathdiscardfate
// DELETE FROM public.ecopathgroup
// DELETE FROM public.ewecase
