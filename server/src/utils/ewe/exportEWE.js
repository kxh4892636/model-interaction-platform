const { Pool,Client } = require('pg')
var config = {
    host: 'localhost',
    user: 'postgres',
    password:"123456",
    database:"model",
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
function Basic(Group,singleID){
    let GroupData = []
    let sqlString = ""
    // 解构Group,成[q,w,e,r,t,y,y,u,i,a,d,c,z,'''''''']
    Group.forEach((element,index) => {
        let tmp = []
        sqlString+=sqlstr(index*11+1,11)
        const elKey = Object.keys(element)
        // 存一个ID，用于全部取出来
        tmp.push(singleID)
        tmp.push(index+1)
        tmp.push(element.name===null || !elKey.includes('name')?-9999:element.name)
        tmp.push(element.type===null || !elKey.includes('type')?-9999:element.type)
        tmp.push(element.Biomass===null || !elKey.includes('Biomass')?-9999:element.Biomass)
        tmp.push(element.prodbiom===null || !elKey.includes('prodbiom')?-9999:element.prodbiom)
        tmp.push(element.consbiom===null || !elKey.includes('consbiom')?-9999:element.consbiom)
        tmp.push(element.ecoefficiency===null || !elKey.includes('ecoefficiency')?-9999:element.ecoefficiency)
        tmp.push(element.ProdCons===null || !elKey.includes('ProdCons')?-9999:element.ProdCons)
        tmp.push(element.BiomAcc===null || !elKey.includes('BiomAcc')?0:element.BiomAcc)
        tmp.push(element.Unassim===null || !elKey.includes('Unassim')?0.2:element.Unassim)
        GroupData.push(...tmp)
    });
    return {Data:GroupData,Sql:sqlString.substring(0,sqlString.length-1)}
}

function DietComposition(GroupID,Group,Diet,Detritus,singleID){
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
            // 存一个ID，用于全部取出来
            tmp.ID = singleID
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
            Data.push({ID:singleID,PredID:PredID,RecordID:recordid,PreyID:GroupID["Detritus"],Diet:0,Detritus:Detritus[GroupID[el.name]-1]["Detritus"]})
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
            Data.push({ID:singleID,PredID:GroupID[Detritus[index].name],RecordID:recordid,PreyID:GroupID["Detritus"],Diet:0,Detritus:Detritus[index]["Detritus"]})
            // console.log(recordid)
            // 每push一次，record就加1
            recordid+=1
        }
    })
    return Data
}
function FleetLandDisc(GroupID,FleetID,Land,Discard,singleID){
    let Data = []
    let recordid = 0
    for(let i=0;i<Land.length;i++){
        Object.keys(FleetID).forEach(el=>{
            let tmp={}
            // 存一个ID，用于全部取出来
            tmp.ID = singleID
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
function FleetDiscardFate(GroupID,FleetID,DiscardFate,singleID){
    let Data = []
    DiscardFate.forEach(el=>{
        let tmp = {}
        // 存一个ID，用于全部取出来
        tmp.ID = singleID
        tmp.GroupID = GroupID["Detritus"]
        tmp.FleetID = FleetID[el.name]
        tmp.FleetName = el.name
        tmp.DiscardFate = el["Detritus"]
        Data.push(tmp)
    })
    // console.log(Data)
    return Data
} 
function CRUDFunc(Group,Fleet,Diet,Detritus,DiscardFate,Land,Discard,num){
    const GroupID = genID(Group)
    const FleetID = genID(Fleet)
    // 自动解构Group Basic
    const BasicSql =  Basic(Group,num)
    // Diet (predid,preyid,diet,Detritus) dx 4
    const DietSql = deconstruct(DietComposition(GroupID,Group,Diet,Detritus,num),6)
    // FleetLandDisc (Groupid,Fleetid,landing,discards) dx 4
    const LandDiscSql = deconstruct(FleetLandDisc(GroupID,FleetID,Land,Discard,num),6)
    // DiscardFate (Groupid,fleetid,Discardfate) dx 3
    const DiscardFateSql = deconstruct(FleetDiscardFate(GroupID,FleetID,DiscardFate,num),5)

    // SQL语句
    const InsertGroup = `INSERT INTO EcopathGroup(ID,GroupID,GroupName,Type,Biomass,ProdBiom,ConsBiom,EcoEfficiency,ProdCons,BiomAcc,Unassim) VALUES `
    const InsertDiet = `INSERT INTO EcopathDiet(ID,PredID,RecordID,PreyID,Diet,Detritus) VALUES `
    const InsertCatch = `INSERT INTO EcopathCatch(ID,RecordID,GroupID,FleetID,Landing,Discards) VALUES `
    const InsertDF = `INSERT INTO EcopathDiscardFate(ID,GroupID,FleetID,FleetName,DiscardFate) VALUES `

    return new Promise((reslove,reject)=>{
        const database = pool.connect().then((client) => {
            return client
                    // 插入Group数据
                .query(`INSERT INTO ewecase(ID) VALUES ($1)`,[num])
                .then(()=>{
                    client.query(InsertGroup+BasicSql.Sql,BasicSql.Data,(err, res) => {
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
                    reslove("完成插入")
                    client.release()
                })
              })
              .catch((err) => {
                client.release()
                console.log(err.stack)
              })
        })

    })
    
}
exports.CRUDdatabase = (Group,Fleet,Diet,Detritus,DiscardFate,Land,Discard,num)=>{
    return new Promise((reslove,reject)=>{
        pool.connect().then((client) => {
            return client
              .query('SELECT * FROM ewecase WHERE id = $1', [num])
              .then(async(res) => {
                // console.log(res.rows[0])
                    if(res.rows[0]!==undefined){
                        client.release()
                        console.log("已存在")
                        reslove("已存在")
                    }
                    else{
                        const database = await CRUDFunc(Group,Fleet,Diet,Detritus,DiscardFate,Land,Discard,num)
                        // console.log("database",database)
                        reslove(database)
                    }
              })
              .catch((err) => {
                client.release()
                console.log(err.stack)
              })
          })
    })
}

exports.ModifyDatabase = (ModifyData,singleID,Group,Fleet)=>{
    return new Promise((reslove,reject)=>{
        let returndata
        let querysql = ""
        const GroupID = genID(Group)
        const FleetID = genID(Fleet)
        ModifyData.forEach((el,index)=>{
            // 生成不同的插入语句，具体情况具体分析 
            if(el.tablename==="ecopathcatch"){
              el.groupname = GroupID[el.groupname]
              querysql=`update ${el.tablename} set ${el.attribute}=${el.value} where id='${singleID}' and ${el.attrgroup}='${el.groupname}'`
            //   console.log(`update ${el.tablename} set ${el.attribute}=${el.value} where id='${singleID}' and ${el.attrgroup}='${el.groupname}'`)
            }
            else if(el.tablename==="ecopathdiscardfate"){
              el.groupname = FleetID[el.groupname]
              querysql=`update ${el.tablename} set ${el.attribute}=${el.value} where id='${singleID}' and ${el.attrgroup}='${el.groupname}'`
            //   console.log(`update ${el.tablename} set ${el.attribute}=${el.value} where id='${singleID}' and ${el.attrgroup}='${el.groupname}'`)
            }
            else if(el.tablename==="ecopathdiet"){
              el.groupname1 = GroupID[el.groupname1]
              el.groupname2 = GroupID[el.groupname2]
              querysql=`update ${el.tablename} set ${el.attribute}=${el.value} where id='${singleID}' and ${el.attrgroup1}='${el.groupname1}' and ${el.attrgroup2}='${el.groupname2}'`
            //   console.log(`update ${el.tablename} set ${el.attribute}=${el.value} where id='${singleID}' and ${el.attrgroup1}='${el.groupname1}' and ${el.attrgroup2}='${el.groupname2}'`)
            }
            else{
              // ecopathgroup的情况
              querysql=`update ${el.tablename} set ${el.attribute}=${el.value} where id='${singleID}' and ${el.attrgroup}='${el.groupname}'`
            //   console.log(`update ${el.tablename} set ${el.attribute}=${el.value} where id='${singleID}' and ${el.attrgroup}='${el.groupname}'`)
            }
    
            // 执行到最后一个sql语句的时候，需要返回一个promise对象用于下一步操作是
            if(index+1===ModifyData.length){
                returndata =         
                pool.query(querysql)
                .then((res) => {
                    // console.log('user:', Object.keys(res))
                    console.log("")
                })
                .catch((err) =>
                    setImmediate(() => {
                        throw err
                    })
                )
            }
            else{
                pool.query(querysql)
                .then((res) => {
                    // console.log('user:', Object.keys(res))
                    console.log("")
                })
                .catch((err) =>
                    setImmediate(() => {
                        throw err
                    })
                )
            }
        })
        reslove(returndata)
    })
    
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