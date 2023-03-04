import { Request, Response } from "express";
import fs from "fs";
import dataService from "../services/data_service";

const getDetail = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.getDetail(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const getJSON = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.getJSON(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

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

const getUVET = async (req: Request, res: Response) => {
  try {
    const filePath = await dataService.getUVET(
      req.query.id as string,
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

const getShp = async (req: Request, res: Response) => {
  try {
    res.status(200).json(dataService.getShp(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const getText = async (req: Request, res: Response) => {
  try {
    res.status(200).json(dataService.getText());
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const uploadData = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await dataService.uploadData(req.file!));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export default { getDetail, getImage, getJSON, getMesh, getShp, getUVET, getText, uploadData };
