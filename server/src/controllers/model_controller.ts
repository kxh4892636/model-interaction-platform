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
import { eweService } from "../services/ewe_service";


const Import = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.Import_Model(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};
const RunEcoPath = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.RunEcoPath(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};
const RunEcoSim = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.RunEcoSim(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};
const RunEcoSim_Switch = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.RunEcoSim_Switch(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};
const GroupPlot_Switch = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.GroupPlot_Switch(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};
const FleetPlot_Switch = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.FleetPlot_Switch(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};
const RunEcoSpace = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.RunEcoSpace(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};
const RunEcoSpace_Switch = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.RunEcoSpace_Switch(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};
const RunEcoSpace_SwitchMap = async (req: Request, res: Response) => {
  try {
    res.status(200).send(await eweService.RunEcoSpace_SwitchMap(req, res));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
    console.log(error);
  }
};

const water = async (req: Request, res: Response) => {
  try {
    const type = req.query.action;
    if (type === "hydrodynamics") {
      // set sse
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      const result = await modelService.runHydrodynamics(
        req.query.paramKeys as string,
        req.query.projKey as string,
        req.query.title as string,
        req.query.projectID as string,
        res
      );
    } else if (type === "quality") {
      // set sse
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      const result = await modelService.runQuality(
        req.query.waterKey as string,
        req.query.paramKeys as string,
        req.query.projKey as string,
        req.query.title as string,
        req.query.projectID as string,
        res
      );
    } else if (type === "sand") {
      // set sse
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      const result = await modelService.runSand(
        req.query.waterKey as string,
        req.query.paramKeys as string,
        req.query.projKey as string,
        req.query.title as string,
        req.query.projectID as string,
        res
      );
    } else if (type === "stop") {
      const result = await modelService.stopModel(req.query.modelID as string);
      res.status(200).json(result);
    } else if (type === "info") {
      const result = await modelService.getModel(req.query.modelID as string);
      res.status(200).json(result);
    }
  } catch (error) {
    const type = req.body.action;
    if (error instanceof Error) {
      console.log(error.message);
      console.log(error.stack);
      if (type === "info" || type === "stop") {
        res.status(200).json({ status: "fail", content: error.message });
      } else;
    } else;
    console.log(error);
  }
};

export const modelController = 
{ Import,
  RunEcoPath,
  RunEcoSim,
  RunEcoSim_Switch,
  GroupPlot_Switch,
  FleetPlot_Switch,
  RunEcoSpace,
  RunEcoSpace_Switch,
  RunEcoSpace_SwitchMap,
  water };

// DELETE FROM public.ecopathcatch
// DELETE FROM public.ecopathdiet
// DELETE FROM public.ecopathdiscardfate
// DELETE FROM public.ecopathgroup
// DELETE FROM public.ewecase
