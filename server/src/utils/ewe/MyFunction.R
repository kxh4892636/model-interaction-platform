library(data.table)
library(rjson)
# 线粗细的设置
linewidth = function(value){
	if(0<value & value<0.1){
		return (1)
	} else if(0.1<=value & value<0.3){
		return (3)
	}else if(0.3<=value & value<0.5){
		return (5)
	}else if(0.5<=value & value<0.7){
		return (7)
	}else if(0.7<=value){
		return (9)
	}
}
Mywebplot <- function(Rpath.obj, eco.name = attr(Rpath.obj, 'eco.name'), line.col = 'grey',
                    highlight = NULL, highlight.col = c('black', 'red', 'orange'), 
                    labels = FALSE, label.pos = NULL, label.num = FALSE, label.cex = 1,
                    fleets = FALSE, type.col = 'black', box.order = NULL){
  #Need to define variables to eliminate check() note about no visible binding
  TL <- TLlevel <- type <- n <- x.space <- x.offset <- Group <- x.pos <- GroupNum <- NULL
  
  pointmap <- data.table(GroupNum = 1:length(Rpath.obj$TL), 
                         Group    = Rpath.obj$Group, 
                         type     = Rpath.obj$type, 
                         TL       = Rpath.obj$TL, 
                         Biomass  = Rpath.obj$Biomass)

  pointmap[TL < 2,               TLlevel := 1]
  pointmap[TL >= 2.0 & TL < 3.0, TLlevel := 2]
  pointmap[TL >= 3.0 & TL < 3.5, TLlevel := 3]
  pointmap[TL >= 3.5 & TL < 4.0, TLlevel := 4]
  pointmap[TL >= 4.0 & TL < 4.5, TLlevel := 5]
  pointmap[TL >= 4.5 & TL < 5.0, TLlevel := 6]
  pointmap[TL >= 5.0,            TLlevel := 7]
  
  pointmap[Biomass < 0.1, symbolSize  := 10]
  pointmap[Biomass >= 0.1 & Biomass < 1, symbolSize  := 20]
  pointmap[Biomass >= 1 & Biomass < 5.0, symbolSize  := 30]
  pointmap[Biomass >= 5 & Biomass < 20, symbolSize  := 40]
  pointmap[Biomass >= 20 & Biomass < 50, symbolSize  := 50]
  pointmap[Biomass >= 50 & Biomass < 100, symbolSize  := 60]
  pointmap[Biomass >= 100 & Biomass < 300, symbolSize  := 70]
  pointmap[Biomass >= 300,            symbolSize  := 80]

  #Web connections
  tot.catch <- Rpath.obj$Landings + Rpath.obj$Discards
  pred      <- pointmap[!type %in% 1:2, GroupNum]
  # 网状图：
  # 1.node代表群组+舰队，node大小代表计算出的Biomass量
  # 2.node之间的线，代表捕食关系
  # 3.线的粗细即DietComposition（DC）  Landings + Discards
  Mydata = list()
  count = 1
  # 捕食者的数量 type=0
  prednum = Rpath.obj$NUM_GROUPS - Rpath.obj$NUM_GEARS
  for(i in pred){
    #echarts的关系图id必须要求事字符串
	source = as.character(i)
    if(pointmap[GroupNum == i, type] == 0){
      prey <- which(Rpath.obj$DC[, i] > 0)
	  # DietFleet记录下传输的数据
	  DietFleet = Rpath.obj$DC
    }
    if(pointmap[GroupNum == i, type] == 3){
      gear.num <- i - (Rpath.obj$NUM_GROUPS - Rpath.obj$NUM_GEARS)
      prey <- which(tot.catch[, gear.num] > 0)
	  DietFleet = tot.catch
    }
    for(j in prey){
	  # 检索到舰队时需要减去之前的prednum，以为又是单独数据，从1开始了
	  if(i>prednum){
		dietcatchvalue = DietFleet[j, i-prednum]
		dietcatch = linewidth(DietFleet[j, i-prednum])
	  }
	  else{
	    dietcatchvalue = DietFleet[j, i]
		dietcatch = linewidth(DietFleet[j, i])
	  }

	  #echarts的关系图id必须要求事字符串
	  target = as.character(j)
	  Mydata[[count]] = list(source = source,target = target,sourcename=pointmap[GroupNum == i, Group],targetname=pointmap[GroupNum == j, Group],dietcatch=dietcatch,dietcatchvalue=dietcatchvalue)
	  #print(source,target)
	  count = count + 1 
      #lines(c(pred.x, prey.x[j]), c(pred.y, prey.y[j]), col = line.col)
    }
  }
  prenode = toJSON(pointmap)
  link = toJSON(Mydata)
  return(list(prenode=prenode,link=link))
}