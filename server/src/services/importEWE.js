
function HandleGroup(data){
    const GroupID  = {}
    const Data = []
    data.forEach(element => {
      GroupID[element.GroupID] = element.GroupName
      let tmp = {}
      tmp.key = element.GroupName
      tmp.name = element.GroupName
      tmp.type = element.Type
      if(element.Biomass !== -9999){tmp.Biomass = element.Biomass }
      if(element.ProdBiom !== -9999){tmp.PB = element.ProdBiom }
      if(element.ConsBiom !== -9999){tmp.QB = element.ConsBiom }
      if(element.EcoEfficiency !== -9999){tmp.EE = element.EcoEfficiency }
      if(element.ProdCons !== -9999){tmp.ProdCons = element.ProdCons }
      tmp.BiomAcc = element.BiomAcc
      tmp.Unassim = element.Unassim
      Data.push(tmp)
    });
    return {GroupID:GroupID,Basic:Data}
}
  
function HandleDiet(GroupID,PredID,PredSQL,DietData){
    // GroupID为ID与名字的对应
    // PredID为type=0即捕食者的id
    // console.log(PredID)
    // PredSQL为"ELECT PredID FROM ecopathdietcomp order by PredID" 仅把ID查出来,统计每个出现的次数,方便循环
    // DietData为捕食者数据
    const Data = []

    // node-adodb这个库查出来全是[{},{},{}]这种格式,弄成[....]
    const PredNum = []
    PredSQL.forEach(el=>{
        PredNum.push(...Object.values(el))
    })
    // 数组统计出现次数
    const objGroup = PredNum.reduce(function (obj, name) {
        obj[name] = obj[name] ? ++obj[name] : 1;
        return obj;
    }, {});
    // console.log(objGroup)
    // 根据keys遍历
    const objGroupKey = Object.keys(objGroup)
    // 记录index位置,Diet
    let count = 0
    objGroupKey.forEach(el=>{
        // 是捕食者才生成tmp
        if(PredID.includes(Number(el))){
        let tmp = {}
        tmp.name = GroupID[el]
        tmp.key = GroupID[el]
        for(let i=0;i<objGroup[el];i++){
            tmp[GroupID[DietData[count].PreyID]] = DietData[count].Diet
            count += 1
        }
        Data.push(tmp)
        }
        else{
        count+=objGroup[el]
        }
    })
    // console.log(count)
    return Data
}

function HandleDetritus(GroupID,DetritusSQL){
const Data = []
DetritusSQL.forEach((element,index) => {
    let tmp = {}
    tmp.name = GroupID[index+1]
    tmp.key = GroupID[index+1]
    tmp.Detritus = element.DetritusFate
    Data.push(tmp)
});
// 补上最后一个没有多大实际意义的项，方便入数据库到时候的处理

if(DetritusSQL.length!==Object.keys(GroupID).length){
    Data.push({"name":"Detritus","key":"Detritus","Detritus":0})
}
// console.log(Data)
return Data
}

function HandleLandDisc(GroupID,FleetID,LandDiscSQL){
const Land = []
const Disc = []
let count = 0
Object.keys(GroupID).forEach(el=>{
    let tmp1 = {}
    let tmp2 = {}
    tmp1.name = GroupID[el]
    tmp1.key = GroupID[el]
    tmp2.name = GroupID[el]
    tmp2.key = GroupID[el]
    for(let i=0;i<FleetID.length;i++){
    tmp1[FleetID[i].FleetName] = LandDiscSQL[count].Landing
    tmp2[FleetID[i].FleetName] = LandDiscSQL[count].Discards
    count+=1
    Land.push(tmp1)
    Disc.push(tmp2)
    }
})
return {Land:Land,Disc:Disc}
}

function HandleDiscardFate(FleetID,DiscFateSQL){
    const Data = []
    DiscFateSQL.forEach((el,index)=>{
    let tmp = {}
    tmp.name = FleetID[index].FleetName
    tmp.key = FleetID[index].FleetName
    tmp.Detritus = el.DiscardFate
    Data.push(tmp)
    })
    return Data
}

exports.query = async (connection)=> {
    const GroupSQL = await connection.query('SELECT * FROM ecopathgroup');
    // 将名字为"Detritus"的ID选出来，因为有些定义很恶心
    // console.log(GroupSQL.filter(item => item.GroupName === "Detritus")[0].GroupID)
    const DietSQL = await connection.query('SELECT * FROM ecopathdietcomp order by PredID');
    const PredSQL = await connection.query('SELECT GroupID FROM ecopathgroup where Type = 0');
    const PredNumSQL = await connection.query('SELECT PredID FROM ecopathdietcomp order by PredID');
    const DetritusSQL = await connection.query(`SELECT DetritusFate FROM ecopathdietcomp where PreyID=${GroupSQL.filter(item => item.GroupName === "Detritus")[0].GroupID}`);
    const FleetID = await connection.query('SELECT FleetID,FleetName FROM ecopathfleet order by FleetID');
    const LandDiscSQL = await connection.query('SELECT * FROM ecopathcatch order by GroupID');
    const iscFateSQL = await connection.query('SELECT * FROM ecopathdiscardfate');
    return new Promise((reslove,reject)=>{
        try {
          const PredID = []
          PredSQL.forEach(el=>{
            PredID.push(...Object.values(el))
          })
          const GroupID = HandleGroup(GroupSQL).GroupID
          let returndata = {}
          returndata.Basic = HandleGroup(GroupSQL).Basic
          returndata.Diet = HandleDiet(GroupID,PredID,PredNumSQL,DietSQL)
          returndata.Detritus = HandleDetritus(GroupID,DetritusSQL)
          returndata.Land = HandleLandDisc(GroupID,FleetID,LandDiscSQL).Land
          returndata.Disc = HandleLandDisc(GroupID,FleetID,LandDiscSQL).Disc
          returndata.DiscardFate = HandleDiscardFate(FleetID,iscFateSQL)
          console.log("导入文件成功")
          reslove(returndata)
        } catch (error) {
            console.log("ERROR",error)
          reject(error)
        }
    })
}
