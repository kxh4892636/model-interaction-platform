// TODO comments
import express from "express";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { count } from "console";

const prisma = new PrismaClient();
const router = express.Router();

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
      const filePath = path.resolve("../data" + info.data);
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

router.get("/case/list", async (req, res) => {
  try {
    const data = await prisma.temp.findMany();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/temp/data", async (req, res) => {
  try {
    const id = req.query.id;
    const info = await prisma.temp.findUnique({
      where: {
        id: id as string,
      },
    });

    if (info) {
      const filePath = path.resolve("../data" + info.data);
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

router.put("/temp/data", async (req, res) => {
  try {
    const title = req.query.title;
    // const info = await prisma.temp.create({
    //   data: {
    //     data: `/temp/`,
    //     id: crypto.randomUUID(),
    //     title:,
    //   },
    // });

    if (info) {
    } else {
      res.json("can't find data by id");
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
