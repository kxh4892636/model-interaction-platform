const cs = require("child_process");
const fs = require("fs");
const path = require("path");
const { query } = require("../../utils/ewe/importEWE");
const { CRUDdatabase, HandleReturn, FlowDiagram } = require("../../utils/ewe/exportEWE");

exports.test_get = (request, response) => {
  response.send("Hello Express");
};

exports.test_post = (request, response) => {
  console.log("获得请求了");
  console.log(request.body);
  console.log(JSON.stringify(request.body));
  let file = path.resolve(__dirname, "../R/file.json");
  // JSON.stringify(request.body) 需要字符串对象
  fs.writeFile(file, JSON.stringify(request.body), { encoding: "utf8" }, (err) => {
    if (!err) {
      console.log("data没错");
    } else {
      console.log(err);
    }
  });
  // 貌似只能send一个
  response.send("得到请求了");
};

exports.R_test = (req, res) => {
  let file = path.resolve(__dirname, "../R/file.json");
  fs.writeFile(file, JSON.stringify(req.body), { encoding: "utf8" }, (err) => {
    if (!err) {
      cs.exec("Rscript R/test.R R/file.json EcoPath", (error, stdout, stderr) => {
        if (error) {
          console.error("error:", error);
        }
        // console.log('stdout: ' + stdout);
        // console.log(typeof(stdout))
        //[1] "{\"NUM_GROUPS\":25, 有[1] 导致得从4位置开始截取切片
        const data = JSON.parse(stdout.slice(4));
        // console.log("qweqweqweqweqweqweqweqweqweqweqweqweq")
        // console.log(data)
        res.send(data);
      });
    } else {
      console.log(err);
    }
  });
};

exports.R_EcoSim = (req, res) => {
  // let file = path.resolve(__dirname, '../R/file.json')
  // fs.writeFile(file, JSON.stringify(req.body), { encoding: 'utf8' }, (err)=>{
  //     if(!err){
  cs.exec("Rscript R/test.R R/file.json EcoSim", (error, stdout, stderr) => {
    if (error) {
      console.error("error:", error);
    }
    const data = JSON.parse(stdout.slice(4));
    res.send(data);
  });
  //     }
  //     else{
  //         console.log(err);
  //     }
  // })
};

exports.R_Ecopath = (req, res) => {
  const Group = req.body.Group;
  const Diet = req.body.Diet;
  // 解构后的
  let GroupData = [];
  let sqlString = "";
  let GroupID = {};
  // 解构Group,成[q,w,e,r,t,y,y,u,i,a,d,c,z,'''''''']
  Group.forEach((element, index) => {
    // 生成ID各个生物群组
    GroupID[element.name] = index + 1;
    // 拼用于插入多条数据的sql语句,8个属性,dx设为8
    sqlString += sqlstr(index * 8 + 1, 8);
    let tmp = [];
    tmp.push(element.name === null ? -9999 : element.name);
    tmp.push(element.type === null ? -9999 : element.type);
    tmp.push(element.Biomass === null ? -9999 : element.Biomass);
    tmp.push(element.PB === null ? -9999 : element.PB);
    tmp.push(element.EE === null ? -9999 : element.EE);
    tmp.push(element.ProdCons === null ? -9999 : element.ProdCons);
    tmp.push(element.BioAcc === null ? 0 : element.BioAcc);
    tmp.push(element.UNAssim === null ? 0.2 : element.UNAssim);
    GroupData.push(...tmp);
    // 前端的basic input配置表里是缺少这两的,采用的示例数据含有Discard,EWE中还没有找到生物群组的Discards在哪设置
    if (index === Group.length - 1) {
      GroupID["Discards"] = index + 2;
      GroupID["import"] = index + 3;
    }
  });

  // Diet多一步,要先弄成(predid, preyid, diet)的形势
  let DietData = [];
  Diet.forEach((el) => {
    const PredID = GroupID[el.name];
    // 个循环用的人也很多，但是效率最低（输出的 key 是数组索引），如果遍历的是对象，输出的则是对象的属性名
    for (let key in el) {
      let tmp = {};
      tmp.PredID = PredID;
      if (key != "name" && el[key] !== "NA" && key != "key") {
        tmp.PreyID = GroupID[key];
        tmp.Diet = el[key];
        DietData.push(tmp);
      }
    }
  });
  // 解构(predid, preyid, diet),成[q,w,e,r,t,y,y,u,i,a,d,c,z,'''''''']
  let sqlDiet = [];
  // 拼diet的sql语句
  let sqlStrDiet = "";
  for (let index = 0; index < DietData.length; index++) {
    sqlStrDiet += sqlstr(index * 3 + 1, 3);
    const tmp = Object.values(DietData[index]);
    sqlDiet.push(...tmp);
  }

  let CGroupTable = `CREATE TABLE IF NOT EXISTS EcopathGroup3(
        GroupID serial NOT NULL PRIMARY KEY,
        GroupName VARCHAR(50) NOT NULL UNIQUE,
        Sequence serial NOT NULL,
        Type NUMERIC NOT NULL,
        Biomass NUMERIC NOT NULL default -9999,
        Area NUMERIC NOT NULL default 1,
        ProdBiom NUMERIC NOT NULL default -9999,
        ConsBiom NUMERIC NOT NULL default -9999,
        EcoEfficiency NUMERIC NOT NULL default -9999,
        OtherMort NUMERIC NOT NULL default -9999,
        ProdCons NUMERIC NOT NULL default -9999,
        BiomAcc NUMERIC NOT NULL default 0,
        BiomAccRate NUMERIC NOT NULL default 0,
        Unassim NUMERIC NOT NULL default 0.2,
        DtImports NUMERIC NOT NULL default 0,
        Export NUMERIC NOT NULL default 0,
        Catch NUMERIC NOT NULL default 0,
        ImpVar NUMERIC NOT NULL default 0,
        GroupIsFish Boolean default True,
        GroupIsInvert Boolean default True,
        NonMarketValue NUMERIC NOT NULL default 0,
        PoolColor VARCHAR(50) NOT NULL default '00000000',
        Immigration NUMERIC NOT NULL default 0,
        Emigration NUMERIC NOT NULL default 0,
        ProdResp NUMERIC NOT NULL default 0,
        RespCons NUMERIC NOT NULL default 0,
        RespBiom NUMERIC NOT NULL default 0,
        Consumption NUMERIC NOT NULL default 0,
        Production NUMERIC NOT NULL default 0,
        Unassimilated NUMERIC NOT NULL default 0
    )`;
  const InsertGroup =
    "INSERT INTO EcopathGroup3(GroupName,Type,Biomass,ProdBiom,EcoEfficiency,ProdCons,BiomAcc,Unassim) VALUES ";
  const CDietTable = `CREATE TABLE IF NOT EXISTS EcopathDiet3(
        PredID integer,
        PreyID integer,
        Diet Numeric
    )`;
  let InsertDiet = "INSERT INTO EcopathDiet3(PredID,PreyID,Diet) VALUES ";
  pool.connect().then((client) => {
    return (
      client
        // 创建Group表
        .query(CGroupTable)
        .then((res) => {
          // client.release()
        })
        .then(() => {
          // 创建Diet表
          client.query(CDietTable, (err, res) => {
            if (err) {
              console.log(err);
            }
            // client.release()
          });
        })
        .then(() => {
          // 插入Group数据
          client.query(
            InsertGroup + sqlString.substring(0, sqlString.length - 1),
            GroupData,
            (err, res) => {
              if (err) {
                console.log(err);
              }
              // client.release()
            }
          );
        })
        .then(() => {
          // 插入Diet数据
          client.query(
            InsertDiet + sqlStrDiet.substring(0, sqlStrDiet.length - 1),
            sqlDiet,
            (err, res) => {
              if (err) {
                console.log(err);
              }
              client.release();
            }
          );
        })
        .catch((err) => {
          client.release();
          console.log(err.stack);
        })
    );
  });
};

// 计算结果
exports.R_test2 = (req, res) => {
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
      cs.exec(`Rscript ./utils/ewe/EcoPath.R ${num}`, (error, stdout, stderr) => {
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
    .catch((err) => console.log(err));
};

// 从模型文件按中导入
exports.R_test3 = (req, res) => {
  console.log("触发了Upload函数");
  // console.log(req)
  // console.log(req.file)
  console.log(req.file.path);
  // console.log(req.file.length)
  const ADODB = require("node-adodb");
  const connection = ADODB.open(
    `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=./${req.file.path};Persist Security Info=False;`
  );
  const result = query(connection);
  result.then((val, err) => {
    if (err) {
      res.send(err);
    } else {
      res.send(val);
      // console.log(val)
    }
  });
};

// 水动力模型计算接口
exports.Hydrodynamic = (req, res) => {
  // req.body 前端传输过来的keys数组
  console.log(req.body);
  res.send(req.body);
};
