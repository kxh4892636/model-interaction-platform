/*
 * @file: /data route
 * @Author: xiaohan kong
 * @Date: 2023-03-02
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-02
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import express from "express";
import { dataController } from "../controllers/data_controller";
import multer from "multer";
import { basename, extname } from "path";
import { dataFoldURL } from "../config/global_data";
import { prisma } from "../utils/tools/prisma";

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const datasetID = req.body.datasetID;
      if (datasetID == "assets") {
        cb(null, dataFoldURL + "/project/assets");
      } else {
        const info = await prisma.dataset.findUnique({
          where: { id: datasetID },
          select: {
            path: true,
          },
        });
        cb(null, dataFoldURL + info!.path + "/input");
      }
    },
    filename: (req, file, cb) => {
      //  解决中文名乱码并将文件中的空格转换为 _
      const fileName = Buffer.from(file.originalname, "latin1").toString("utf8");
      const extName = extname(fileName);
      cb(
        null,
        basename(fileName, extName).split(" ").join("_") + "_" + Date.now().toString() + extName
      );
    },
  }),
});

const dataRoute = express.Router();

// /api/data/detail
dataRoute.get("/detail", dataController.getDetail);
// /api/data/json
dataRoute.get("/json", dataController.getJSON);
// /api/data/mesh
dataRoute.get("/mesh", dataController.getMesh);
// /api/data/uvet
dataRoute.get("/uvet", dataController.getUVET);
// /api/data/image
dataRoute.get("/image", dataController.getImage);
// /api/data/text
dataRoute.get("/text", dataController.getText);
// /api/data/upload
dataRoute.post("/upload", upload.single("file"), dataController.uploadData);
// /api/data/action
dataRoute.post("/action", dataController.dataAction);

export { dataRoute };
