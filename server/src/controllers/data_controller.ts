/*
 * @file: /api/data controller
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Request, Response } from "express";
import { dataService } from "../services/data_service";
import { createReadStream } from "fs";

// get meta data of data by key
const getDetail = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.getDetail(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(200).json(error);
  }
};
// get json by key
const getJSON = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.getJSON(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(200).json(error);
  }
};
// get transformed png of mesh by key
const getMesh = async (req: Request, res: Response) => {
  try {
    const result = await dataService.getMesh(req.query.id as string);
    const cs = createReadStream(result.content);
    cs.on("data", (chunk) => {
      res.write(chunk);
    });
    cs.on("end", () => {
      res.status(200).end();
    });
  } catch (error) {
    console.error(error);
    res.status(200).json(error);
  }
};
// get transformed png of uvet by key
const getUVET = async (req: Request, res: Response) => {
  try {
    const result = await dataService.getUVET(
      req.query.id as string,
      req.query.type as string,
      Number(req.query.currentImage)
    );
    const cs = createReadStream(result.content);
    cs.on("data", (chunk) => {
      res.write(chunk);
    });
    cs.on("end", () => {
      res.status(200).end();
    });
  } catch (error) {
    console.error(error);
    res.status(200).json(error);
  }
};
// get image by key
const getImage = async (req: Request, res: Response) => {
  try {
    const result = await dataService.getImage(req.query.id as string);
    const cs = createReadStream(result.content);
    cs.on("data", (chunk) => {
      res.write(chunk);
    });
    cs.on("end", () => {
      res.status(200).end();
    });
  } catch (error) {
    console.error(error);
    res.status(200).json(error);
  }
};
// do noting
const getText = async (req: Request, res: Response) => {
  try {
    res.status(200).json(dataService.getText());
  } catch (error) {
    console.error(error);
    res.status(200).json(error);
  }
};
/**
 * upload data to server
 * @param req request
 * @param res response
 */
// NOTE req.file
const uploadData = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.uploadData(req.file!, req.body.datasetID as string));
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    } else;
  }
};

// actions of data
const dataAction = async (req: Request, res: Response) => {
  try {
    const type = req.body.action;
    if (type === "rename") {
      res
        .status(200)
        .json(await dataService.renameData(req.body.dataID as string, req.body.title as string));
    } else if (type === "delete") {
      res.status(200).json(await dataService.deleteData(req.body.dataID as string));
    } else {
      throw new Error("don't have this action");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(200).json({ status: "fail", content: error.message });
    }
  }
};

export const dataController = {
  getDetail,
  getImage,
  getJSON,
  getMesh,
  getText,
  getUVET,
  uploadData,
  dataAction,
};
