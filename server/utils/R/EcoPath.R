#加载包
library(RPostgreSQL)
library(stringr)
library(Rpath)
library(rjson)
# 设置当前的工作文件加路径
#setwd(getwd())
#print(getwd())

source(str_c(getwd(),"/utils/R/MyFunction.R",seq="",collapse = NULL))
# 携带参数
args <- commandArgs(trailingOnly = TRUE)

# 定义一个函数，Rpath貌似必须要将Detritus放在未追尾的最后一个,真的真的真的
new.function <- function(DetritusID,rawlength,Data) {
	num = 1
	returndata = c()
	for(i in 1:rawlength){
		if(i != DetritusID){
			returndata[num] = Data[i]
			num = num+1
		}
	}
	returndata[num] = Data[DetritusID]
	returndata = c(returndata,Data[(num+1):length(Data)])
	return(returndata)
}
 



conn = dbDriver("PostgreSQL") 
#建立连接
con <- dbConnect(conn ,
                 host = "localhost", #主机名，默认localhost
                 port = '5432', #端口号，默认5432
                 dbname = 'postgres',  #数据库
                 user = 'postgres', #用户名
                 password = '123456') #安装的时候设的postgresql的密码

#SQL操作: 这里引号里写SQL代码  GroupBasic
re <- dbSendQuery(con, sprintf("SELECT * FROM ecopathgroup%s",args[1]))
#保存数据
Group <- dbFetch(re) 
#diag是列表，其中的一列是连成一条的数据，需要unlist解开，并转成vector
#print(as.vector(unlist(Group[1])))
#清空re值，以便下次使用
dbClearResult(re)

groups = as.vector(unlist(Group[2]))
# 用于判断是否需要对Detritus的顺序进行调整，Rpath这个库对Detritus的顺序还有要求，要处于 生物+detritus+discard+舰船(Fleet)
# Flag在basic diet catch中用到了
Flag = groups[length(groups)] != "Detritus"
FlagID = which(groups=="Detritus")
GroupNum = length(groups)
type = as.vector(unlist(Group[4]))
GroupID = as.vector(unlist(Group[1]))
# 使用which这种方法将捕食者的名字全跳出来
PredName = groups[which(type==0)]
PredNameIndex = GroupID[which(type==0)]
# 记录一下生产者，即type=1的数量
PreyNum = length(groups[which(type==1)])
# Biomass PB QB EE ProdCons这四个需要去额外标记哪些是输入值，哪些是计算出的新值（最终以红或蓝标记）
InputFlag = list()

# SQL操作 Basic属性
biomass = as.vector(unlist(Group[5]))
#NA在R语言中好像是不可以进行比较的，因此要放在前头
InputFlag[[1]] = groups[which(biomass == -9999)]
biomass[which(biomass == -9999)] <- NA
pb = as.vector(unlist(Group[7]))
InputFlag[[2]] = groups[which(pb == -9999)]
pb[which(pb == -9999)] <- NA
qb = as.vector(unlist(Group[8]))
InputFlag[[3]] = groups[which(qb == -9999)]
qb[which(qb == -9999)] <- NA
ee = as.vector(unlist(Group[9]))
InputFlag[[4]] = groups[which(ee == -9999)]
ee[which(ee == -9999)] <- NA
prodcons = as.vector(unlist(Group[11]))
InputFlag[[5]] = groups[which(prodcons == -9999)]
prodcons[which(prodcons == -9999)] <- NA
bioacc = as.vector(unlist(Group[12]))
unassim = as.vector(unlist(Group[14]))
# 赋予名字，方便之后变json对象
names(InputFlag) = c("biomassInputFlag","pbInputFlag","qbInputFlag","eeInputFlag","prodconsInputFlag")

# SQL操作 Diet
re <- dbSendQuery(con, sprintf("SELECT * FROM ecopathdiet%s",args[1]))
#保存数据
Diet <- dbFetch(re)
#清空re值，以便下次使用
dbClearResult(re)
pred <- as.vector(unlist(Diet[1]))
prey <- as.vector(unlist(Diet[3]))
diet <- as.vector(unlist(Diet[4]))


# SQL操作 FleetCatah
re <- dbSendQuery(con, sprintf("SELECT * FROM ecopathcatch%s",args[1]))
#保存数据
Catch <- dbFetch(re)
#清空re值，以便下次使用
dbClearResult(re)
CatchGroupid = as.vector(unlist(Catch[2]))
CatchFleetid = as.vector(unlist(Catch[3]))
CatchLand = as.vector(unlist(Catch[4]))
CatchDiscard = as.vector(unlist(Catch[5]))

# SQL操作 FleetDiscardFate
re <- dbSendQuery(con, sprintf("SELECT * FROM ecopathdiscardfate%s",args[1]))
#保存数据
DiscardFate <- dbFetch(re)
discard = rep(0,GroupNum)
#清空re值，以便下次使用
dbClearResult(re)
fleetname = as.vector(unlist(DiscardFate[3]))
fleetDiscardF = as.vector(unlist(DiscardFate[4]))
FleetNum = length(fleetname)

# SQL操作 找到Diet中Detritus一列，preyid=21
re <- dbSendQuery(con, sprintf("SELECT * FROM ecopathdiet%s where preyid=%s order by predid",args[1],GroupID[which(groups=="Detritus")]))
#保存数据
Detritus <- dbFetch(re)
# 1:Discards 加上Fleet的数量
detritus = as.vector(unlist(Detritus[5]))

#清空re值，以便下次使用
dbClearResult(re)


# 先处理Group Basic Input 中的基本输入
for(i in 1:(length(fleetname)+1)){
	{
		if(i==1){
		    groups = c(groups,"Discards")
			type = c(type,2)
			# Fleet的Discard
			discard = c(discard,0)
		}
		else{
			groups = c(groups,fleetname[i-1])
			type = c(type,3)
			# Fleet的Discard
			discard = c(discard,fleetDiscardF[i-1])
		}
	}
	biomass = c(biomass,NA)
	pb = c(pb,NA)
	qb = c(qb,NA)
	ee = c(ee,NA)
	prodcons = c(prodcons,NA)
	bioacc = c(bioacc,NA)
	unassim = c(unassim,NA)
	# 在处理Group Basic Input 中的Discards 对应的就是Basic中的Discard Fate,discard以及fleets都是设为0
	detritus = c(detritus,0)
}


# 处理Catch 用索引去对应
CatchList = list()
# 拼接字符串名称，先把现有舰队放入 "Trawlers.disc" "Midwater.disc" "Dredgers.disc"
CatchName = fleetname
for(i in 1:FleetNum){
    Landtmp = c(CatchLand[which(CatchFleetid==i)],rep(NA,FleetNum+1))
	Disctmp = c(CatchDiscard[which(CatchFleetid==i)],rep(NA,FleetNum+1))
	if(Flag){
		Landtmp = new.function(FlagID,GroupNum,Landtmp)
		Disctmp = new.function(FlagID,GroupNum,Disctmp)
	}
	# 在帅选的同时，在后面补上无聊的值 list添加新值要用【【】】双双中括号
	CatchList[[i]] = Landtmp
	CatchList[[i+FleetNum]] = Disctmp 
	# 字符串拼接
	CatchName = c(CatchName,str_c(fleetname[i],".disc",seq="",collapse = NULL))
}


# 处理Diet
DietList = list()
dietcount = 1
for(i in PredNameIndex){
  #print(PredName[i])
  # diet值对应的位置
  index <- which(pred==i)
  # 吃了那些物种的id索引
  #print(prey[index])
  # 用来遍历diet
  num <- 1
  tmp = c()
  # 遍历捕食者 length(PredName)捕食者长度，PreyNum type为1的生产者长度 1：type为2的Detritus 1：Discards 1：import
  for(j in 1:(length(PredName)+PreyNum+1+1+1)){
	#print(j %in% prey[index])
	{
		if(j %in% prey[index]){
			tmp[j]=diet[index[which(prey[index]==j)]]
			num <- num+1
		}
		else
		{
			tmp[j]=NA
		}
	}
  }
  if(Flag){
	tmp = new.function(FlagID,GroupNum,tmp)
  }
  DietList[[dietcount]] = tmp
  dietcount =  dietcount+1 
}


#Groups and types for the R Ecosystem

#Rpath官网上的数据
stgroups <- c(rep(NA, 3), rep('Roundfish1', 2), rep('Roundfish2', 2), 
             rep('Flatfish1', 2), rep('Flatfish2', 2), rep(NA, 14))

# 中国南海1970
#stgroups <- c(rep(NA, 15), rep('Hairtail', 2), rep(NA,4), rep('Large croakers', 2), NA,
#              rep('Large demersal fish', 2), rep(NA,3), rep('Large pelagic fish', 2), rep(NA, 7+2))

if(Flag){
	groups = new.function(FlagID,GroupNum,groups)
	type = new.function(FlagID,GroupNum,type)
	biomass = new.function(FlagID,GroupNum,biomass)
	pb = new.function(FlagID,GroupNum,pb)
	qb = new.function(FlagID,GroupNum,qb)
	ee = new.function(FlagID,GroupNum,ee)
	prodcons = new.function(FlagID,GroupNum,prodcons)
	bioacc = new.function(FlagID,GroupNum,bioacc)
	unassim = new.function(FlagID,GroupNum,unassim)
	detritus = new.function(FlagID,GroupNum,detritus)
	discard = new.function(FlagID,GroupNum,discard)
}

REco.params <- create.rpath.params(group = groups, type = type)
REco.params$model[, Biomass := biomass]
REco.params$model[, PB := pb]
# QB暂时还不清楚对应的EWE变量
REco.params$model[, QB :=  qb]
#EE for groups w/o biomass
REco.params$model[, EE := ee]

#Production to Consumption for those groups without a QB
REco.params$model[, ProdCons:= prodcons]

#Biomass accumulation and unassimilated consumption
REco.params$model[, BioAcc  := bioacc]
REco.params$model[, Unassim := unassim]

#Detrital Fate
REco.params$model[, Detritus := detritus]
REco.params$model[, Discards := discard]


# 设置model的Landing DiscardsFate
for(i in 1:FleetNum){
	# 要用unlist解开
	# print(unlist(CatchList[i]))
	REco.params$model[, CatchName[i] := unlist(CatchList[i])]
	REco.params$model[, CatchName[i+FleetNum] := unlist(CatchList[i+FleetNum])]
}

############################################################################################
#Group parameters 中国南海1970
#REco.params$stanzas$stgroups[, VBGF_Ksp := c(0.409999996423721, 0.230000004172325, 0.275000005960464, 0.589999973773956)]
#REco.params$stanzas$stgroups[, Wmat     := c(0.23, 0.002, 0.002,  0.013)]


#Individual stanza parameters
#REco.params$stanzas$stindiv[, First   := c(rep(c(0, 18), 4))]
#REco.params$stanzas$stindiv[, Last    := c(17,75,17,100,17,90,17,65)]
#REco.params$stanzas$stindiv[, Z       := c(2.3, 1.5, 2.36, 1.43, 2.6, 
#                                           1.44, 2.87, 0.9)]

#REco.params$stanzas$stindiv[, Leading := rep(c(F, T), 4)]
#REco.params <- rpath.stanzas(REco.params)
############################################################################################
#stanzaplot(REco.params, StanzaGroup = 1)

# 设置model的Diet
for(i in 1:length(PredName)){
	REco.params$diet[, PredName[i] := unlist(DietList[i])]
}

REco <- rpath(REco.params, eco.name = 'R Ecosystem')
REcoJson = toJSON(REco)
InputFlagJson = toJSON(InputFlag)
# 拼上InputFlagJson
#         c配合collapse使用	两次截取字符串为了去REcoJson的最后一个}和InputFlagJson的第一个{
#out=str_c(c(substr(REcoJson,1,nchar(REcoJson)-1),substring(InputFlagJson,2)),collapse=",")


Myplot = Mywebplot(REco)

out = list(Basic=REcoJson,InputFlag=InputFlagJson,prenode=Myplot$prenode,link=Myplot$link)
print(toJSON(out))


