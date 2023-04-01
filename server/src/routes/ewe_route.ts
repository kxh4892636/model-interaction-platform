const express = require("express");
const router = express.Router();

// 导入用户路由处理函数模块
const Handler = require("../services/ewe_services");

// 测试get，post请求
router.post("/R_test2", Handler.R_test2);
router.post("/R_test3", Handler.R_test3);
router.post("/hydrodynamics", Handler.hydrodynamics);
export default router;
