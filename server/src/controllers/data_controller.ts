/*
 * @file: data controller
 * @Author: xiaohan kong
 * @Date: 2023-03-02
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-02
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Request, Response } from "express";
import fs from "fs";
import dataService from "../services/data_service";

// get data list
const getList = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.getList());
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

// get meta data of data by key
const getDetail = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.getDetail(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// get json by key
const getJSON = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.getJSON(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// get transformed png of mesh by key
const getMesh = async (req: Request, res: Response) => {
  try {
    const filePath = await dataService.getMesh(req.query.id as string);
    const cs = fs.createReadStream(filePath);
    cs.on("data", (chunk) => {
      res.write(chunk);
    });
    cs.on("end", () => {
      res.status(200).end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// get transformed png of uvet by key
const getUVET = async (req: Request, res: Response) => {
  try {
    const filePath = await dataService.getUVET(
      req.query.id as string,
      req.query.type as string,
      Number(req.query.currentImage)
    );
    const cs = fs.createReadStream(filePath);
    cs.on("data", (chunk) => {
      res.write(chunk);
    });
    cs.on("end", () => {
      res.status(200).end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// get image by key
const getImage = async (req: Request, res: Response) => {
  try {
    const filePath = await dataService.getImage(req.query.id as string);
    const cs = fs.createReadStream(filePath);
    cs.on("data", (chunk) => {
      res.write(chunk);
    });
    cs.on("end", () => {
      res.status(200).end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// get transformed json of shp by key
const getShp = async (req: Request, res: Response) => {
  try {
    res.status(200).json(dataService.getShp(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// do noting
const getText = async (req: Request, res: Response) => {
  try {
    res.status(200).json(dataService.getText());
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
// upload data
const uploadData = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.uploadData(req.file!));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export default {
  getList,
  getDetail,
  getImage,
  getJSON,
  getMesh,
  getShp,
  getUVET,
  getText,
  uploadData,
};
