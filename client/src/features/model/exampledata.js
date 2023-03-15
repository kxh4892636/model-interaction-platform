const group = ['Seabirds', 'Whales', 'Seals', 'JuvRoundfish1', 'AduRoundfish1', 'JuvRoundfish2', 'AduRoundfish2', 'JuvFlatfish1', 'AduFlatfish1',
             'JuvFlatfish2', 'AduFlatfish2', 'OtherGroundfish', 'Foragefish1','Foragefish2', 'OtherForagefish', 'Megabenthos', 'Shellfish',
             'Macrobenthos', 'Zooplankton', 'Phytoplankton', 'Detritus', 'Discards', 'Trawlers', 'Midwater', 'Dredgers']
const type = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,3]
const stgroups = ["NA","NA","NA","Roundfish1","Roundfish1","Roundfish2","Roundfish2","Flatfish1","Flatfish1","Flatfish2","Flatfish2",
                  "NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA"]

const sumdata = {
  group : ['Seabirds', 'Whales', 'Seals', 'JuvRoundfish1', 'AduRoundfish1', 'JuvRoundfish2', 'AduRoundfish2', 'JuvFlatfish1', 'AduFlatfish1',
              'JuvFlatfish2', 'AduFlatfish2', 'OtherGroundfish', 'Foragefish1','Foragefish2', 'OtherForagefish', 'Megabenthos', 'Shellfish',
              'Macrobenthos', 'Zooplankton', 'Phytoplankton', 'Detritus', 'Discards', 'Trawlers', 'Midwater', 'Dredgers'],
  type : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,3,3,3],
  stgroups : ["NA","NA","NA","Roundfish1","Roundfish1","Roundfish2","Roundfish2","Flatfish1","Flatfish1","Flatfish2","Flatfish2",
                    "NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA"],
  Biomass : [0.0149,0.4540,"NA","NA",1.3900,"NA",5.5530,"NA",5.7660,"NA",0.7390,7.4000,5.1000,4.7000,5.1000,"NA",7.0000,17.4000,23.0000,10.0000,"NA","NA","NA","NA","NA"],
  PB : [0.098,0.031,0.100,2.026,0.420,2.100,0.425,1.500,0.260,1.100,0.180,0.600,0.610,0.650,1.500,0.900,1.300,7.000,39.000,240.000,"NA","NA","NA","NA","NA"],
  QB : [76.750,6.976, 34.455, "NA",2.190, "NA",3.780, "NA",1.440, "NA",1.690,1.764,3.520,5.650,3.600,2.984, "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA"],
  EE : ["NA","NA",0.8,"NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA",0.8,"NA","NA","NA","NA","NA","NA","NA","NA","NA"],
  ProdCons : ["NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA",0.25,0.35,0.25,"NA","NA","NA","NA","NA","NA"],
  BioAcc : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"NA","NA","NA"],
  UNAssim : [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.4,0,0,0,"NA","NA","NA"],
  DetInput : ["NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA","NA",0,0,"NA","NA","NA",],
  Detritus : [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  Discards : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  Trawlers : [0.00,0.00,0.00,0.00,0.08,0.00,0.32,0.00,0.09,0.00,0.05,0.20,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,"NA","NA","NA"],
  Midwater : [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.30,0.08,0.02,0.00,0.00,0.00,0.00,0.00,0.00,0.00,"NA","NA","NA"],
  Dredgers : [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1,0.5,0.0,0.0,0.0,0.0,0.0,"NA","NA","NA"],
  Trawlersdisc : [1e-5, 1e-7, 0.001, 0.001, 0.005, 0.001, 0.009, 0.001, 0.04, 0.001,0.01, 0.08, 0.001, 0.001, 0.001,0,0,0,0,0,0,0,"NA","NA","NA"],
  Midwaterdisc : [0,0, 0.001, 0.001, 0.01, 0.001, 0.01, 0,0,0,0, 0.05, 0.05,0.01, 0.01, 0,0,0,0,0,0,0, "NA","NA","NA"],
  Dredgersdisc : [0,0,0, 0.001, 0.05, 0.001, 0.05, 0.001, 0.05, 0.001, 0.01, 0.05,0,0,0, 0.09, 0.01, 1e-4, 0,0,0,0, "NA","NA","NA"] ,
}

let modalarray = [] 
for (let i = 0; i < 21; i++) {
  let tmp={}
  tmp.key = group[i] 
  tmp.name = group[i] 
  tmp.type = type[i]
  if(stgroups[i]!=="NA")
  {
    tmp.stgroup = stgroups[i]
  }
  
  modalarray.push(tmp)
}

// console.log(modalarray)
const Fleet = [
  {
    key:"Trawlers",
    name:"Trawlers",
    type:3
  },
  {
    key:"Midwater",
    name:"Midwater",
    type:3
  },
  {
    key:"Dredgers",
    name:"Dredgers",
    type:3
  },
]



const GroupExample = []
for (let i = 0; i < 21; i++) { 
  let tmp={}
  tmp.name = sumdata.group[i]
  tmp.key = sumdata.group[i]
  tmp.type = sumdata.type[i]
  tmp.stgroups = sumdata.stgroups[i]!=="NA"?sumdata.stgroups[i]:null
  tmp.Biomass = sumdata.Biomass[i]!=="NA"?sumdata.Biomass[i]:null
  tmp.PB = sumdata.PB[i]!=="NA"?sumdata.PB[i]:null
  tmp.QB = sumdata.QB[i]!=="NA"?sumdata.QB[i]:null
  tmp.EE = sumdata.EE[i]!=="NA"?sumdata.EE[i]:null
  tmp.ProdCons = sumdata.ProdCons[i]!=="NA"?sumdata.ProdCons[i]:null
  tmp.BiomAcc = sumdata.BioAcc[i]!=="NA"?sumdata.BioAcc[i]:null
  tmp.Unassim = sumdata.UNAssim[i]!=="NA"?sumdata.UNAssim[i]:null
  tmp.DetInput = sumdata.DetInput[i]!=="NA"?sumdata.DetInput[i]:null
  tmp.Detritus = sumdata.Detritus[i]!=="NA"?sumdata.Detritus[i]:null
  GroupExample.push(tmp)
} 


const sumdietdata = {
  group : ['Seabirds', 'Whales', 'Seals', 'JuvRoundfish1', 'AduRoundfish1', 'JuvRoundfish2', 'AduRoundfish2', 'JuvFlatfish1', 'AduFlatfish1',
  'JuvFlatfish2', 'AduFlatfish2', 'OtherGroundfish', 'Foragefish1','Foragefish2', 'OtherForagefish', 'Megabenthos', 'Shellfish',
  'Macrobenthos', 'Zooplankton', 'Phytoplankton', 'Detritus', 'Discards','import'],
  Seabirds: ['NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA', 0.10, 0.25, 0.20, 0.15,'NA','NA','NA','NA','NA',0.30,'NA','NA'],
  Whales: ['NA','NA','NA', 0.01,"NA",0.01,"NA",0.01,"NA",0.01,"NA","NA","NA","NA",0.1,"NA","NA",'NA',0.86,'NA','NA','NA','NA'],
  Seals:['NA','NA','NA', 0.05, 0.1, 0.05, 0.2, 0.005, 0.05, 0.005, 0.01, 0.24, 0.005,0.005,0.005,0.005, 0.09, 'NA','NA','NA','NA','NA','NA'] ,
  JuvRoundfish1:['NA','NA','NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0010,'NA','NA',0.0500,0.0001,'NA',0.0200,0.7785,0.1000,0.0500,'NA','NA'],
  AduRoundfish1:['NA','NA','NA','NA','NA',0.001,0.010,0.001,0.050,0.001,0.010,0.290,0.100,0.100,0.347,0.030,'NA',0.050,0.010,'NA','NA','NA','NA'],
  JuvRoundfish2:['NA','NA','NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0010,'NA','NA',0.0500,0.0001,'NA',0.0200,0.7785,0.1000,0.0500,'NA','NA'],
  AduRoundfish2:['NA','NA','NA',0.0001,'NA',0.0001,'NA',0.0001,0.0001,0.0001,0.0001,0.1000,0.0500,0.0500,0.0500,0.2684,0.0100,0.3700,0.0010,'NA',0.1000,'NA','NA'],
  JuvFlatfish1:['NA','NA','NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0001,'NA','NA','NA','NA',0.0001,0.0001,'NA',0.4160,0.4334,0.1000,0.0500,'NA','NA'],
  AduFlatfish1:['NA','NA','NA','NA','NA','NA','NA',0.0001,0.0001,0.0001,0.0001,0.0001,'NA','NA',0.0010,0.0500,0.0010,0.6000,0.2475,'NA',0.1000,'NA','NA'],
  JuvFlatfish2:['NA','NA','NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0001,'NA','NA','NA','NA',0.0001,0.0001,'NA',0.4160,0.4334,0.1000,0.0500,'NA','NA'],
  AduFlatfish2:['NA','NA','NA','NA','NA','NA','NA',0.0001,'NA',0.0001,'NA','NA','NA','NA',0.0001,0.0001,0.0001,0.4400,0.3895,'NA',0.1700,'NA','NA'],
  OtherGroundfish:['NA','NA','NA',0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0001,0.0500,0.0800,0.0992,0.3000,0.1500,0.0100,0.3000,0.0100,'NA','NA','NA','NA'],
  Foragefish1:['NA','NA','NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0001,'NA','NA','NA','NA','NA','NA','NA','NA',0.8196,0.0600,0.1200,'NA','NA'],
  Foragefish2:['NA','NA','NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0001,'NA','NA','NA','NA','NA','NA','NA','NA',0.8196,0.0600,0.1200,'NA','NA'],
  OtherForagefish:['NA','NA','NA',0.0001,'NA',0.0001,'NA',0.0001,'NA',0.0001,'NA','NA','NA','NA','NA','NA','NA','NA',0.8196,0.0600,0.1200,'NA','NA'],
  Megabenthos:['NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA',0.10,0.03,0.55,'NA','NA',0.32,'NA','NA'],
  Shellfish:['NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA',0.3,0.5,0.2,'NA','NA'],
  Macrobenthos:['NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA',0.01,0.20,0.20,'NA',0.59,'NA','NA'],
  Zooplankton:['NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA',0.2,0.6,0.2,'NA','NA'],
  Phytoplankton:['NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA','NA']
}  
  const name = Object.keys(sumdietdata)
  const DietExample = []
  for(let i=1;i<20;i++){
    // 按照Table格式要求，第一行表头为属性，datasource需要去一一对应分派
    let tmp={}
    tmp.name = name[i]
    tmp.key = i
    for(let j=0;j<23;j++){
      if(sumdietdata[name[i]][j]!=="NA")
      {
        tmp[sumdietdata.group[j]] = sumdietdata[name[i]][j]
      }

    }
    DietExample.push(tmp)
  }
// console.log(GroupExample)
const DetritusExample = []
const DuoYu = ['Discards', 'Trawlers', 'Midwater', 'Dredgers']
group.forEach(el=>{
  if(!DuoYu.includes(el)){
    let tmp = {}
    tmp.name = el
    tmp.Detritus = el==="Detritus"?0:1
    tmp.key = el
    DetritusExample.push(tmp)
  }
})
// console.log(DetritusExample)
// Fishery中的Discard Fate
const FishDiscFateExample = []
DuoYu.forEach(el=>{
  if(el!=="Discards")
  {
    let tmp = {}
    tmp.name = el
    tmp.Detritus = 1
    tmp.key = el
    FishDiscFateExample.push(tmp)
  }
})

// Fishery 中的 Landing
const Landing = {
  Trawlers : [0,0,0,0,0.08, 0, 0.32, 0, 0.09, 0, 0.05, 0.2, 0,0,0,0,0,0,0,0,0],
  Midwater : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.08, 0.02, 0, 0, 0, 0, 0, 0],
  Dredgers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.5, 0, 0, 0, 0, ]
}
const LandingExample = []
group.forEach((el,index)=>{
  if(!DuoYu.includes(el)){
    let tmp = {}
    tmp.name = el
    tmp.Trawlers = Landing.Trawlers[index]
    tmp.Midwater = Landing.Midwater[index]
    tmp.Dredgers = Landing.Dredgers[index]
    tmp.key = el
    LandingExample.push(tmp)
  }
})

// Fishery 中的 Discards
const Discard = {
  Trawlers : [1e-5, 1e-7, 0.001, 0.001, 0.005, 0.001, 0.009, 0.001, 0.04, 0.001,0.01, 0.08, 0.001, 0.001, 0.001, 0,0,0,0,0,0],
  Midwater : [0,0, 0.001, 0.001, 0.01, 0.001, 0.01,0,0,0,0, 0.05, 0.05,0.01, 0.01, 0,0,0,0,0,0],
  Dredgers: [0,0,0 , 0.001, 0.05, 0.001, 0.05, 0.001, 0.05, 0.001, 0.01, 0.05,0,0,0 , 0.09, 0.01, 1e-4,0,0,0 ]
}
const DiscardExample = []
group.forEach((el,index)=>{
  if(!DuoYu.includes(el)){
    let tmp = {}
    tmp.name = el
    tmp.Trawlers = Discard.Trawlers[index]
    tmp.Midwater = Discard.Midwater[index]
    tmp.Dredgers = Discard.Dredgers[index]
    tmp.key = el
    DiscardExample.push(tmp)
  }
})
export {modalarray,Fleet,GroupExample,DietExample,DetritusExample,FishDiscFateExample,LandingExample,DiscardExample}