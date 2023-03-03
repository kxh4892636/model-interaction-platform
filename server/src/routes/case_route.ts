import express from "express";
import caseController from "../controllers/case_controller";

const router = express.Router();

router.get("/case", caseController.getCase);
router.get("/list", caseController.getList);

export default router;
