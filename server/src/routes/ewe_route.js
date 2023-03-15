const express = require("express");
const router = express.Router();

// 导入用户路由处理函数模块
const Handler = require("../services/ewe_services");

// 文件的上传
const multer = require("multer");
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
          console.log("./src/services/uploadfile");
          cb(null, "./src/services/uploadfile"); // 上传文件的目录
          break;
        default:
          console.log("上传文件类型出错,请检查文件类型与后缀");
          break;
      }
    }
  },
  filename: function (request, files, cb) {
    // 对于ewemdb之前版本的文件，将其另存为accdb新版本
    if (files.originalname.split(".")[1] === "ewemdb") {
      cb(null, files.originalname.split(".")[0] + ".eweaccdb");
    } else {
      cb(null, files.originalname);
    }
    // console.log(files)
    const orgName = files.originalname; // 上传文件的目录、文件名称保存到全局变量中
  },
});
// multer 配置
const upload = multer({
  storage,
});

// 测试get，post请求
router.get("/", Handler.test_get);
router.post("/", Handler.test_post);

router.post("/R_test", Handler.R_test);
router.post("/R_EcoSim", Handler.R_EcoSim);
router.post("/R_Ecopath", Handler.R_Ecopath);
router.post("/R_test2", Handler.R_test2);
router.post("/R_test3", upload.single("file"), Handler.R_test3);

module.exports = router;
