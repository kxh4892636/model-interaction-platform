import express from "express";
import multer from "multer";
import dataController from "../controllers/data_controller";
import { dataFoldURL } from "../../config/global_data";

const router = express.Router();
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

router.get("/detail", dataController.getDetail);
router.get("/json", dataController.getJSON);
router.get("/mesh", dataController.getMesh);
router.get("/uvet", dataController.getUVET);
router.get("/image", dataController.getImage);
router.get("/shp", dataController.getShp);
router.get("/text", dataController.getText);
router.post("/upload", upload.single("file"), dataController.uploadData);

export default router;
