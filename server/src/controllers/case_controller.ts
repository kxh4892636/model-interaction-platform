import { Request, Response } from "express";
import caseService from "../services/case_service";

const getList = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await caseService.getList());
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const getCase = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await caseService.getCase(req.query.id as string));
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export default { getList, getCase };
