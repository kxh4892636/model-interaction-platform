const { Pool,Client } = require('pg')
var config = {
    host: 'localhost',
    user: 'postgres',
    password:"123456",
    database:"postgres",
    port:5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
}
var pool = new Pool(config)


// 拼接sql字符串
function sqlstr(num,dx){
    let sqlstr = '('
    for(let i=num;i<num+dx;i++){
        i===num+dx-1?sqlstr=sqlstr+'$'+i:sqlstr=sqlstr+'$'+i+','
    }
    sqlstr+='),'
    return sqlstr
}
function genID(Data){
    let DataID = {}
    Data.forEach((element,index) => {
        // 生成ID各个生物群组
        DataID[element.name] = index+1
    });
    return DataID
}
// 专门用于结构的函数
function deconstruct(Data,dx){
    let sqlString=""
    let ReturnData = []
    for(let index=0;index<Data.length;index++){
        sqlString+=sqlstr(index*dx+1,dx)
        const tmp = Object.values(Data[index])
        ReturnData.push(...tmp)
    }
    return {Data:ReturnData,Sql:sqlString.substring(0,sqlString.length-1)}
}
// 直接结构了
function Basic(Group){
    let GroupData = []
    let sqlString = ""
    // 解构Group,成[q,w,e,r,t,y,y,u,i,a,d,c,z,'''''''']
    Group.forEach((element,index) => {
        let tmp = []
        sqlString+=sqlstr(index*10+1,10)
        const elKey = Object.keys(element)
        tmp.push(index+1)
        tmp.push(element.name===null || !elKey.includes('name')?-9999:element.name)
        tmp.push(element.type===null || !elKey.includes('type')?-9999:element.type)
        tmp.push(element.Biomass===null || !elKey.includes('Biomass')?-9999:element.Biomass)
        tmp.push(element.PB===null || !elKey.includes('PB')?-9999:element.PB)
        tmp.push(element.QB===null || !elKey.includes('QB')?-9999:element.QB)
        tmp.push(element.EE===null || !elKey.includes('EE')?-9999:element.EE)
        tmp.push(element.ProdCons===null || !elKey.includes('ProdCons')?-9999:element.ProdCons)
        tmp.push(element.BiomAcc===null || !elKey.includes('BiomAcc')?0:element.BiomAcc)
        tmp.push(element.Unassim===null || !elKey.includes('Unassim')?0.2:element.Unassim)
        GroupData.push(...tmp)
    });
    return {Data:GroupData,Sql:sqlString.substring(0,sqlString.length-1)}
}

function DietComposition(GroupID,Group,Diet,Detritus){
    // 先生成type列表
    let type = []
    Group.forEach(el=>{
        type.push(el.type)
    })
    let Data = []
    let recordid = 1
    Diet.forEach((el,index)=>{
        const PredID = GroupID[el.name]
        // 个循环用的人也很多，但是效率最低（输出的 key 是数组索引），如果遍历的是对象，输出的则是对象的属性名
        for(let key in el){
            let tmp = {}
            tmp.PredID = PredID
            if(key!="name"&&el[key]!=='NA'&&key!="key"){
                tmp.RecordID = recordid
                tmp.PreyID = GroupID[key]
                tmp.Diet = el[key]==="NA"?0:el[key]
                // 其实Detritus[index]["Detritus"]可以直接换成1，中国南海数据库里的定义应该只有0，1两个值
                // GroupID[el.name]-1 不能单纯用index，永远通过名字去定位。id是索引加1 这里需要减去1
                tmp["Detritus"] = key==="Detritus"?Detritus[GroupID[el.name]-1]["Detritus"]:0
                Data.push(tmp)
                // 每push一次，record就加1
                recordid+=1
            }
        } 
        // Diet中长度为捕食者的长度，排除了生产者与碎屑
        // 给没有捕食Detritus，强行加一条 diet按数据库设0
        if(!Object.keys(el).includes("Detritus")){
            Data.push({PredID:PredID,RecordID:recordid,PreyID:GroupID["Detritus"],Diet:0,Detritus:Detritus[GroupID[el.name]-1]["Detritus"]})
            // console.log(recordid)
            // 每push一次，record就加1
            recordid+=1
        }
    })
    // 最后强行补上生产者Phytoplankton等等 碎屑者Detritus
    // 从Diet的长度开始，到Detritus长度结束，中间的即是需要强补的 XXXXXXXXXXX
    // 得根据索引位置来，中国南海1970的生产者就是在1，2位置
    type.forEach((el,index)=>{
        if(el===1 || el===2){
            // console.log(typeof(el),index)
            // console.log({PredID:GroupID[Detritus[index].name],RecordID:recordid,PreyID:GroupID["Detritus"],Diet:0,Detritus:Detritus[index]["Detritus"]})
            Data.push({PredID:GroupID[Detritus[index].name],RecordID:recordid,PreyID:GroupID["Detritus"],Diet:0,Detritus:Detritus[index]["Detritus"]})
            // console.log(recordid)
            // 每push一次，record就加1
            recordid+=1
        }
    })
    return Data
}
function FleetLandDisc(GroupID,FleetID,Land,Discard){
    let Data = []
    let recordid = 0
    for(let i=0;i<Land.length;i++){
        Object.keys(FleetID).forEach(el=>{
            let tmp={}
            tmp.RecordID = recordid
            tmp.GroupID = GroupID[Land[i].name]
            tmp.FleetID = FleetID[el]
            tmp.Landing = Land[i][el]
            tmp.Discards = Discard[i][el]
            Data.push(tmp)
            // 每push一次，record就加1
            recordid+=1
        })
    }
    return Data
}
function FleetDiscardFate(GroupID,FleetID,DiscardFate){
    let Data = []
    DiscardFate.forEach(el=>{
        let tmp = {}
        tmp.GroupID = GroupID["Detritus"]
        tmp.FleetID = FleetID[el.name]
        tmp.FleetName = el.name
        tmp.DiscardFate = el["Detritus"]
        Data.push(tmp)
    })
    // console.log(Data)
    return Data
} 

exports.CRUDdatabase = (Group,Fleet,Diet,Detritus,DiscardFate,Land,Discard,num)=>{
    const GroupID = genID(Group)
    const FleetID = genID(Fleet)
    // 自动解构Group Basic
    const BasicSql =  Basic(Group)
    // Diet (predid,preyid,diet,Detritus) dx 4
    const DietSql = deconstruct(DietComposition(GroupID,Group,Diet,Detritus),5)
    // FleetLandDisc (Groupid,Fleetid,landing,discards) dx 4
    const LandDiscSql = deconstruct(FleetLandDisc(GroupID,FleetID,Land,Discard),5)
    // DiscardFate (Groupid,fleetid,Discardfate) dx 3
    const DiscardFateSql = deconstruct(FleetDiscardFate(GroupID,FleetID,DiscardFate),4)

    // SQL语句
    const CGroupTable = `CREATE TABLE IF NOT EXISTS EcopathGroup${num}(
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
    )`
    const InsertGroup = `INSERT INTO EcopathGroup${num}(GroupID,GroupName,Type,Biomass,ProdBiom,ConsBiom,EcoEfficiency,ProdCons,BiomAcc,Unassim) VALUES `
    const CDietTable = `CREATE TABLE IF NOT EXISTS EcopathDiet${num}(
        PredID integer,
        RecordID integer PRIMARY KEY,
        PreyID integer,
        Diet Numeric,
        Detritus integer
    )`
    const InsertDiet = `INSERT INTO EcopathDiet${num}(PredID,RecordID,PreyID,Diet,Detritus) VALUES `
    const CCatchTable = `CREATE TABLE IF NOT EXISTS EcopathCatch${num}(
        RecordID serial NOT NULL PRIMARY KEY,
        GroupID integer,
        FleetID integer,
        Landing Numeric,
        Discards Numeric
    )`
    const InsertCatch = `INSERT INTO EcopathCatch${num}(RecordID,GroupID,FleetID,Landing,Discards) VALUES `
    const CDFTable = `CREATE TABLE IF NOT EXISTS EcopathDiscardFate${num}(
        GroupID integer,
        FleetID integer PRIMARY KEY,
        FleetName VARCHAR(50),
        DiscardFate integer
    )`
    const InsertDF = `INSERT INTO EcopathDiscardFate${num}(GroupID,FleetID,FleetName,DiscardFate) VALUES `

    // 创建规则，避免重复插入，频繁点击
    const GroupRule = `
        create or replace 
            rule group_insert_ignore as on insert to ecopathgroup${num} 
        where 
            exists 
                (select 1 from ecopathgroup${num} where groupid = new.groupid) 
            do instead nothing; `
    const DietRule = `
        create or replace 
            rule diet_insert_ignore as on insert to ecopathdiet${num} 
        where 
            exists 
                (select 1 from ecopathdiet${num} where recordid = new.recordid) 
            do instead nothing; `
    const CatchRule = `
        create or replace 
            rule catch_insert_ignore as on insert to ecopathcatch${num} 
        where 
            exists 
                (select 1 from ecopathcatch${num} where recordid = new.recordid) 
            do instead nothing; `
    const DFhRule = `
        create or replace 
            rule df_insert_ignore as on insert to ecopathdiscardfate${num} 
        where 
            exists 
                (select 1 from ecopathdiscardfate${num} where fleetid = new.fleetid) 
            do instead nothing; `

    const database = pool.connect().then((client) => {
        return client
        // 创建Group表
          .query(CGroupTable).
          then(()=>{
        // 创建Diet表
            client.query(CDietTable, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("Diet表创建")
            })
        // 创建FleetCatch表
          }).then(()=>{
            client.query(CCatchTable, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("Catch表创建")
            })
        // 创建FleetDiscardFate表
          }).then(()=>{
            client.query(CDFTable, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("Fate表创建")
            })
          }).then(()=>{
            // 加规则Group
            client.query(GroupRule, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("Group规则创建")
            })
          }).then(()=>{
            // 加规则Diet
            client.query(DietRule, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("Diet规则创建")
            })
          }).then(()=>{
            // 加规则Catch
            client.query(CatchRule, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("Catch规则创建")
            })
          }).then(()=>{
            // 加规则DF
            client.query(DFhRule, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("DF规则创建")
            })
          }).then(()=>{
            // 插入Group数据
            client.query(InsertGroup+BasicSql.Sql,BasicSql.Data, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("插入Group数据")
            })
          }).then(()=>{
            // 插入Diet数据
            client.query(InsertDiet+DietSql.Sql,DietSql.Data, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("插入Diet数据")
            })
          }).then(()=>{
            // 插入Catch LD数据
            client.query(InsertCatch+LandDiscSql.Sql,LandDiscSql.Data, (err, res) => {
                if (err) {console.log(err)};
                // client.release()
                console.log("插入Catch数据")
            })
          }).then(()=>{
            // 插入discard fate数据
            client.query(InsertDF+DiscardFateSql.Sql,DiscardFateSql.Data, (err, res) => {
                if (err) {console.log(err)};
                console.log("插入Fate数据")
                client.release()
            })
          })
          .catch((err) => {
            client.release()
            console.log(err.stack)
          })
    })

    return database
}


// 对结果的处理也放在了后端，前端接收到数据直接设置状态就好了
exports.HandleReturn = (Basic,InputFlag)=>{
    //  Biomass PB QB EE ProdCons这四个需要去额外标记哪些是输入值，哪些是计算出的新值（最终以红或蓝标记）
    const keys = Object.keys(Basic.Group)
    const data = []
    keys.forEach((gp,index)=>{
        // 筛选出捕食者，生产者，和Detritus碎屑
        if(gp!=="Discards" && Basic.type[gp]!==3){
            let tmp = {}
            tmp.name = gp
            tmp.key = gp
            tmp.type = Basic.type[gp]
            // TL即trophic
            tmp.TL = Basic.TL[gp]
            tmp.Biomass = Basic.Biomass[gp]
            // 如果是包括的话，像当于是输入值，记为1.计算出的值记为0
            tmp.BiomassFlag = InputFlag.biomassInputFlag.includes(gp)?1:0
            tmp.PB = Basic.PB[gp]
            tmp.PBFlag = InputFlag.pbInputFlag.includes(gp)?1:0
            tmp.QB = Basic.QB[gp]
            tmp.QBFlag = InputFlag.qbInputFlag.includes(gp)?1:0
            tmp.EE = Basic.EE[gp]
            tmp.EEFlag = InputFlag.eeInputFlag.includes(gp)?1:0
            data.push(tmp)
        }
    })
    return data
}
const colorpanel = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',
                    "#17b978", "#00adb5", "#393e46", "#6a2c70", "#b83b5e", "#f08a5d", "#f9ed69", "#95e1d3", "#eaffd0",
                    "#ff2e63", "#08d9d6", "#aa96da", "#ffde7d", "#f8f3d4", "#53354a", "#903749", "#e84545", "#2b2e4a",
                    "#0dceda", "#6ef3d6", "#c6fce5", "#d72323", "#005691", "#dbedf3", "#f73859", "#ffc93c", "#ff9a3c",
                    "#ff6f3c", "#f5c7f7", "#5e63b6", "#fdc7ff", "#7a08fa", "#2eb872", "#f12b6b", "#e43a19", "#015051"]


exports.FlowDiagram=(prenode,link)=>{
    const order = {}
    let maxnum = 0
    // 在R语言处理的阶段，最多TL为7
    for(let i=1;i<8;i++){
        let num = 1
        prenode.TLlevel.filter((item,index)=> {
            if(item === i){
                order[prenode.Group[index]] = num
                // 只要真就加一，这也导致了后面要额外减去1
                num += 1
            }
        })
        maxnum = maxnum>num?maxnum:num
    }
    let num0 = 0
    let num12 = 0 
    let num3 = 0
    // 统计每个类型的出现次数
    prenode.type.forEach(el=>{
        if(el===0){
            num0+=1
        }
        else if(el===1 || el===2){
            num12+=1
        }
        else{
            num3+=1
        }
    })
    
    // 两个点，要三个小段，要除以3.但这刚好不要Discards，直接除，省去减一
    const dnum12 = Math.floor((maxnum-1)/num12)
    for(let i=0;i<num12;i++){
        // 这用return，会直接终止整个函数？？？？？？？？？？？？？？？？
        if(prenode.Group[num0+i]==="Discards"){continue}
        order[prenode.Group[num0+i]] = 1+dnum12*(i+1)
    }

    // 舰队循环
    for(let i=0;i<num3;i++){
        order[prenode.Group[num0+num12+i]] = maxnum-1
    }
    // 至此对画图时的x轴的index分发完成
    

    const node = []
    const categories = []
    const targetcolor = []
    // 记录由于DIscards存在导致的舰队颜色错位一
    let count = 0
    prenode.Group.forEach((el,index)=>{
        if(el==="Discards"){return}
        let tmp = {}
        // echarts的关系图id必须要求事字符串
        tmp.id = prenode.GroupNum[index]+""
        tmp.name= el
        tmp.Biomass = prenode.Biomass[index]
        tmp.GroupNum = prenode.GroupNum[index]
        tmp.categories = prenode.GroupNum[index]+""
        tmp.TL = prenode.TL[index]

        // 点位置的设置
        tmp.x = order[el]*9
        tmp.y = -prenode.TL[index]*10
        // 在 data 内配置饼状图颜色,确保点有颜色
        tmp.itemStyle = {color:colorpanel[count]}
        // 点的大小
        tmp.symbolSize =prenode.symbolSize[index]
        count += 1
        // tmp.type = prenode.type[index]
        node.push(tmp)
        targetcolor.push({"id":tmp.GroupNum,"color":colorpanel[index]})
        categories.push({name:prenode.Group[index]})
    })
    link.forEach(el=>{
        // [ { id: 10, color: '#17b978' } ] 控制台金黄色为数字，白色为字符串
        const tmp = targetcolor.filter(item=> item.id===parseInt(el.target))
        // 这样声明线的颜色
        el.lineStyle= {
            normal: {
                // show:true,
                width:el.dietcatch,
                color:tmp[0].color,//设置为’source’时是与起点颜色相同，’target’是与终点颜色相同。
                curveness: 0.1,	//边的曲度，支持从 0 到 1 的值，值越大曲度越大，也可设置为直线
                // type :'solid', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                // opacity :'0.4', 
                    // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
                },
            }
    })
    return {"node":node,"link":link,"categories":categories}
}