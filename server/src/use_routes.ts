// TODO comments
import express from "express";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { dataFoldURL } from "../config/global_data";

const prisma = new PrismaClient();
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dataFoldURL + "/temp");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

router.get("/case/list", async (req, res) => {
  try {
    const data = await prisma.case.findMany();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/case/detail", async (req, res) => {
  try {
    const id = req.query.id;
    const info = await prisma.case.findUnique({
      where: {
        id: id as string,
      },
    });

    await prisma.case.update({
      where: {
        id: id as string,
      },
      data: {
        count: info?.count! + 1,
      },
    });
    if (info) {
      res.json(info);
    } else {
      res.json("can't find data by id");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/data/detail", async (req, res) => {
  try {
    const id = req.query.id;
    const info = await prisma.data.findUnique({
      where: {
        id: id as string,
      },
    });
    if (info) {
      res.json(info);
    } else {
      res.json("can't find data by id");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/data/data", async (req, res) => {
  try {
    const id = req.query.id;
    const info = await prisma.data.findUnique({
      where: {
        id: id as string,
      },
    });

    if (info) {
      const filePath = dataFoldURL + info.data;
      const buffer = fs.readFileSync(filePath).toString();
      const json = JSON.parse(buffer);
      res.json(json);
    } else {
      res.json("can't find data by id");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/temp/data", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (file) {
    const filePath: string = file.path;
  }

  res.json("success");
});

export default router;
