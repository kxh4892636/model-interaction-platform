import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/data/list", async (req, res) => {
  try {
    const data = await prisma.data.findMany();
    res.json(data);
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
    res.json(info);
  } catch (error) {
    console.log(error);
  }
});

export default router;
