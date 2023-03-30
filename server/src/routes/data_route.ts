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
import multer from "multer";
import dataController from "../controllers/data_controller";
import { dataFoldURL } from "../config/global_data";
import path from "path";

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dataFoldURL + "/temp/input");
    },
    filename: (req, file, cb) => {
      //  解决中文名乱码并将文件中的空格转换为 _
      const fileName = Buffer.from(file.originalname, "latin1").toString("utf8");
      const extName = path.extname(fileName);
      cb(
        null,
        path.basename(fileName, extName).split(" ").join("_") +
          "_" +
          Date.now().toString() +
          extName
      );
    },
  }),
});

// /data/list
router.get("/list", dataController.getList);
// /data/detail
router.get("/detail", dataController.getDetail);
// /data/json
router.get("/json", dataController.getJSON);
// /data/mesh
router.get("/mesh", dataController.getMesh);
// /data/uvet
router.get("/uvet", dataController.getUVET);
// /data/image
router.get("/image", dataController.getImage);
// /data/shp
router.get("/shp", dataController.getShp);
// /data/text
router.get("/text", dataController.getText);
// /data/upload
router.post("/upload", upload.single("file"), dataController.uploadData);

export default router;
