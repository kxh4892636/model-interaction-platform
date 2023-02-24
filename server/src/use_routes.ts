// TODO comments
import express from "express";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import crypto from "crypto";
import { dataFoldURL } from "../config/global_data";
import { getDataType } from "../utils/get_data_type";

const prisma = new PrismaClient();
const router = express.Router();
router.use(express.json());

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dataFoldURL + "/temp");
    },
    filename: (req, file, cb) => {
      // NOTE 解决中文名乱码
      cb(null, Buffer.from(file.originalname, "latin1").toString("utf8"));
    },
  }),
});

router.get("/case/list", async (req, res) => {
  try {
    const data = await prisma.case.findMany();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json(error);
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
    res.json(error);
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
    res.json(error);
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
    res.json(error);
  }
});

router.post("/data/data", async (req, res) => {
  try {
  } catch (error) {}
});

router.post("/temp/data", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (file) {
    const filePath: string = file.path;
    const id = crypto.randomUUID();

    await prisma.data.create({
      data: {
        data: filePath.replaceAll("\\", "/").split(dataFoldURL)[1],
        id: id,
        temp: true,
        title: file.filename.split(".")[0],
        type: getDataType(filePath),
      },
    });

    res.status(200).json(id);
  } else {
    res.status(500).json("upload failed");
  }

  // {
  //   fieldname: 'file',
  //   originalname: 'äº\x8Cæ\x9C\x88æ\x8A¥è´¦.xlsx',
  //   encoding: '7bit',
  //   mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   destination: 'D:/project/001_model_interaction_platform/data/temp',
  //   filename: '二月报账.xlsx',
  //   path: 'D:\\project\\001_model_interaction_platform\\data\\temp\\二月报账.xlsx',
  //   size: 15161
  // }
});

export default router;
