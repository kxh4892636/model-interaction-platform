import { Request, Response } from "express";
const cs = require("child_process");
const { query } = require("../../utils/ewe/importEWE");
const { CRUDdatabase, HandleReturn, FlowDiagram } = require("../../utils/ewe/exportEWE");

// 计算结果
exports.R_test2 = (req: Request, res: Response) => {
  const Group = req.body.Group;
  const Diet = req.body.Diet;
  const Detritus = req.body.Detritus;
  const DiscardFate = req.body.DiscardFate;
  const Land = req.body.Land;
  const Discard = req.body.Discard;
  const Fleet = req.body.Fleet;
  const num = req.body.singleID;

  // 全部封到exportEWE中去
  const database = CRUDdatabase(Group, Fleet, Diet, Detritus, DiscardFate, Land, Discard, num);
  database
    .then(() => {
      cs.exec(`Rscript ./utils/ewe/EcoPath.R ${num}`, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error("error:", error);
        }

        // [1] TRUE 长度为10 后面还跟着2个空格 10*n-1  5个最后为49  加上“[1] ” 从54开始
        // 如果图标那一块真的要使用图片进行传输的话，多了“pdf 2” 所以要从65开始
        let data = JSON.parse(stdout.slice(54));
        // 得弄两次，第一次弄完还是字符串string类型
        data = JSON.parse(data);
        data.Basic = JSON.parse(data.Basic);
        data.InputFlag = JSON.parse(data.InputFlag);
        data.link = JSON.parse(data.link);
        data.prenode = JSON.parse(data.prenode);
        console.log(data.status, data.statusname);
        // data.status = JSON.parse(data.status);
        // data.statusname = JSON.parse(data.statusname);
        // res.send(data)
        res.send({
          BasicEst: HandleReturn(data.Basic, data.InputFlag),
          Graph: FlowDiagram(data.prenode, data.link),
          status: data.status,
          statusname: data.statusname,
        });
        // res.send(data)
      });
    })
    .catch((err: any) => console.log(err));
};

// 从模型文件按中导入
exports.R_test3 = (req: Request, res: Response) => {
  console.log("触发了Upload函数");
  // console.log(req)
  // console.log(req.file)
  console.log(req.file!.path);
  // console.log(req.file.length)
  const ADODB = require("node-adodb");
  const connection = ADODB.open(
    `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=./${req.file!.path};Persist Security Info=False;`
  );
  const result = query(connection);
  result.then((val: any, err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(val);
      // console.log(val)
    }
  });
};

// 水动力模型计算接口
exports.Hydrodynamic = (req: Request, res: Response) => {
  // req.body 前端传输过来的keys数组
  const process = cs.exec(
    "cd D:\\project\\001_model_interaction_platform\\data\\temp\\model && model.exe"
  );
  let num = 0;
  // process.stdout.on("data", (data) => {
  //   console.log(num);
  //   num += 1;
  // });
  res.status(200).json("test");
};
