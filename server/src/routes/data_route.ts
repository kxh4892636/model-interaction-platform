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
import { dataFoldURL } from "../../config/global_data";

const router = express.Router();
// NOTE multer
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
