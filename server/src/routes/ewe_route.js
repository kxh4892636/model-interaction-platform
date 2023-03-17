const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const Handler = require('../services/ewe_services')


// 文件的上传
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (request, files, cb) {
    if (files.originalname.split(".")[1] != null) {
      console.log(files.originalname);
      let tpName = files.originalname.split(".")[1];
      switch (tpName) {
        case "eweaccdb":
        case "ewemdb":
        case "accdb":
        case "mdb":
          console.log("../../data/temp/model");
          cb(null, "../data/temp/model"); // 上传文件的目录
          break;
        default:
          console.log("上传文件类型出错,请检查文件类型与后缀");
          break;
      }
    }
  }
  })
// multer 配置
const upload = multer({
    storage
})


// 测试get，post请求
router.get('/',Handler.test_get)
router.post('/',Handler.test_post)

router.post("/R_test", Handler.R_test);
router.post("/R_EcoSim", Handler.R_EcoSim);
router.post("/R_Ecopath", Handler.R_Ecopath);
router.post("/R_test2", Handler.R_test2);
router.post("/R_test3", upload.single("file"), Handler.R_test3);
router.post("/Hydrodynamic", Handler.Hydrodynamic);
module.exports = router;
