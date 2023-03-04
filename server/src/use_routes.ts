// TODO comments
import express from "express";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import crypto from "crypto";
import { dataFoldURL } from "../config/global_data";
import { execSync } from "child_process";
import { resolve } from "path";

const prisma = new PrismaClient();
const router = express.Router();
router.use(express.json());

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dataFoldURL + "/temp/input");
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
      const type = info.type;
      const style = info.style;
      if (type === "geojson") {
        const filePath = dataFoldURL + info.data;
        const buffer = fs.readFileSync(filePath).toString();
        const json = JSON.parse(buffer);
        res.json(json);
      } else if (type === "mesh" && info.transform) {
        const filePath = dataFoldURL + info.transform[0];
        const cs = fs.createReadStream(filePath);
        cs.on("data", (chunk) => {
          res.write(chunk);
        });
        cs.on("end", () => {
          res.status(200).end();
        });
      } else if (type === "uvet" && info.transform && style === "raster") {
        // TODO uvet
        const currentImage = Number(req.query.currentImage);

        const filePath =
          dataFoldURL +
          info.transform[0].replace(
            "uvet_petak_transform.png",
            `uvet_petak_transform_${currentImage}.png`
          );
        const cs = fs.createReadStream(filePath);
        cs.on("data", (chunk) => {
          res.write(chunk);
        });
        cs.on("end", () => {
          res.status(200).end();
        });
      } else if (type === "image" || type == "video") {
        const filePath = dataFoldURL + info.data;
        const cs = fs.createReadStream(filePath);
        cs.on("data", (chunk) => {
          res.write(chunk);
        });
        cs.on("end", () => {
          res.status(200).end();
        });
      } else if (type === "shp" && info.transform) {
        const filePath = dataFoldURL + info.transform[0];
        const buffer = fs.readFileSync(filePath).toString();
        const json = JSON.parse(buffer);
        res.json(json);
      } else {
        res.status(200).json("this data need not to send");
      }
    } else {
      res.json("can't find data by id");
    }
  } catch (error) {
    console.error(error);
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
    const output = execSync(
      `python ${resolve("./") + "/utils/python/get_data_type_and_style.py"} ${filePath}`
    );
    const [type, style] = output.toString().trimEnd().split(",");
    let transform: string[] = [];
    let extent: number[] = [];

    if (type === "mesh" || type === "shp") {
      if (type === "mesh") {
        const fileName = file.filename.split(".")[0];
        const transformPath = filePath
          .replace(file.filename, `${fileName}_transform.png`)
          .replace("\\temp\\input", "\\temp\\transform");

        transform.push(transformPath.split("\\").join("/").split(dataFoldURL)[1]);
        const output = execSync(
          `python ${
            resolve("./") + "/utils/python/mesh_transform.py" + " " + filePath + " " + transformPath
          }`
        );
        extent = output
          .toString()
          .trim()
          .replace("(", "")
          .replace(")", "")
          .split(",")
          .map((value) => Number(value));
      } else {
        // TODO 以后写
      }
    }

    await prisma.data.create({
      data: {
        data: filePath.split("\\").join("/").split(dataFoldURL)[1],
        id: id,
        temp: true,
        title: file.filename.split(".")[0],
        type: type,
        style: style,
        extent: extent,
        transform: transform,
      },
    });

    res.status(200).json(id);
  } else {
    res.status(500).json("upload failed");
  }
});

export default router;
