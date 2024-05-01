/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { DATA_FOLDER_PATH } from '@/config/env'
import { orm } from '@/dao'
import { execSync } from 'child_process'
import csv from 'fast-csv'
import fs from 'fs'

const exeFilePath = DATA_FOLDER_PATH + '/template/ewe'

const colorpanel = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
  '#17b978',
  '#00adb5',
  '#393e46',
  '#6a2c70',
  '#b83b5e',
  '#f08a5d',
  '#f9ed69',
  '#95e1d3',
  '#eaffd0',
  '#363636',
  '#08d9d6',
  '#aa96da',
  '#ffde7d',
  '#f8f3d4',
  '#53354a',
  '#903749',
  '#e84545',
  '#2b2e4a',
  '#0dceda',
  '#6ef3d6',
  '#c6fce5',
  '#d72323',
  '#005691',
  '#dbedf3',
  '#f73859',
  '#ffc93c',
  '#ff9a3c',
  '#ff6f3c',
  '#f5c7f7',
  '#5e63b6',
  '#fdc7ff',
  '#7a08fa',
  '#2eb872',
  '#f12b6b',
  '#e43a19',
  '#015051',
]

const GroupPlotName12 = [
  'Biomass',
  'Consumption/Biomass',
  'Feeding Time',
  'P/B,predation.mort,fishing.mort',
  'Predation mortality',
  'Prey',
  'Catch',
  'F(fishing mortality)',
  'Total discards',
  'Discad mortality',
  'Discard survival',
  'Langings',
]
const GroupPlotName = [
  'Biomass',
  'Consumption/Biomass',
  'Mortality:total,fish,pred',
  'Prey',
  'Catch',
]
const FleetPlotName = [
  'Catch',
  'F(fishing mortality)',
  'Landings',
  'Discards',
  'Discad mortality',
  'Discard survival',
]
const Modeltype = {   
    0:"Basic PDE",
    1:"IBM",
    2:"Multi-stanza"
}
// 处理一下Stanze用到的图表
const StanzePlotOption = (data) => {
  Object.keys(data).forEach((item) => {
    const tempStanze = data[item]
    const StanzeNumber = []
    const StanzeIndividual = []
    const StanzePopulation = []
    for (let i = 1; i < tempStanze.Number.length; i++) {
      StanzeNumber.push([i - 1, tempStanze.Number[i]])
      StanzeIndividual.push([i - 1, tempStanze.Individual[i]])
      StanzePopulation.push([i - 1, tempStanze.Population[i]])
    }
    const option = {
      legend: {
        icon: 'roundRect',
      },
      xAxis: {
        type: 'value',
        min: 0, // 设置轴的最小值
        max: tempStanze.Number.length, // 设置轴的最大值
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Number',
          type: 'line',
          data: StanzeNumber,
          symbol: 'none',
        },
        {
          name: 'Individual',
          type: 'line',
          data: StanzeIndividual,
          symbol: 'none',
        },
        {
          name: 'Population',
          type: 'line',
          data: StanzePopulation,
          symbol: 'none',
        },
        {
          name: 'Spawing',
          type: 'line',
          data: [
            [tempStanze.Spawing, 0],
            [tempStanze.Spawing, 1],
          ],
          symbol: 'none',
        },
        {
          name: 'Separartion',
          type: 'line',
          data: [
            [tempStanze.Separartion[1], 0],
            [tempStanze.Separartion[1], 1],
          ],
          symbol: 'none',
        },
      ],
    }
    data[item].option = option
  })
}

const FlowDiagram = (prenode, link) => {
  const order = {}
  let maxnum = 0
  // 在R语言处理的阶段，最多TL为7
  for (let i = 1; i < 8; i++) {
    let num = 1
    // eslint-disable-next-line array-callback-return
    prenode.TLlevel.filter((item, index) => {
      if (item === i) {
        order[prenode.Group[index]] = num
        // 只要真就加一，这也导致了后面要额外减去1
        num += 1
      }
    })
    maxnum = maxnum > num ? maxnum : num
  }
  let num0 = 0
  let num12 = 0
  let num3 = 0
  // 统计每个类型的出现次数
  prenode.Type.forEach((el) => {
    if (el === 0) {
      num0 += 1
    } else if (el === 1 || el === 2) {
      num12 += 1
    } else {
      num3 += 1
    }
  })

  // 两个点，要三个小段，要除以3.但这刚好不要Discards，直接除，省去减一
  const dnum12 = Math.floor((maxnum - 1) / num12)
  for (let i = 0; i < num12; i++) {
    // 这用return，会直接终止整个函数？？？？？？？？？？？？？？？？
    if (prenode.Group[num0 + i] === 'Discards') {
      continue
    }
    order[prenode.Group[num0 + i]] = 1 + dnum12 * (i + 1) - 2
  }

  // 舰队循环
  for (let i = 0; i < num3; i++) {
    order[prenode.Group[num0 + num12 + i]] = maxnum - 1
  }
  // 至此对画图时的x轴的index分发完成

  const node = []
  const categories = []
  const targetcolor = []
  // 记录由于DIscards存在导致的舰队颜色错位一
  let count = 0
  prenode.Group.forEach((el, index) => {
    if (el === 'Discards') {
      return
    }
    const tmp = {}
    // echarts的关系图id必须要求事字符串
    tmp.id = prenode.GroupNum[index] + ''
    tmp.name = el
    tmp.Biomass = prenode.Biomass[index]
    tmp.GroupNum = prenode.GroupNum[index]
    tmp.categories = prenode.GroupNum[index] + ''
    tmp.TL = prenode.TL[index]

    // 点位置的设置
    tmp.x = order[el] * 9
    tmp.y = -prenode.TL[index] * 10
    // 在 data 内配置饼状图颜色,确保点有颜色
    tmp.itemStyle = { color: colorpanel[count] }
    // 点的大小
    tmp.symbolSize = prenode.SymbolSize[index]
    count += 1
    // tmp.type = prenode.type[index]
    node.push(tmp)
    targetcolor.push({ id: tmp.GroupNum, color: colorpanel[index] })
    categories.push({ name: prenode.Group[index] })
  })
  link.forEach((el) => {
    // [ { id: 10, color: '#17b978' } ] 控制台金黄色为数字，白色为字符串
    const tmp = targetcolor.filter((item) => item.id === parseInt(el.target))
    // 这样声明线的颜色
    el.lineStyle = {
      // show:true,
      width: el.dietcatch,
      color: tmp[0].color, // 设置为’source’时是与起点颜色相同，’target’是与终点颜色相同。
      curveness: 0.1, // 边的曲度，支持从 0 到 1 的值，值越大曲度越大，也可设置为直线
      // type :'solid', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
      // opacity :'0.4',
      // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
    }
  })
  return { node: node.slice(1), link, categories: categories.slice(1) }
}

function Retain_Decimals(num) {
  if (num >= 1) return num.toFixed(3) * 1
  else if (num >= 0.1 && num < 1) return num.toFixed(4) * 1
  else if (num >= 0.01 && num < 0.1) return num.toFixed(5) * 1
  else if (num >= 0.001 && num < 0.01) return num.toFixed(6) * 1
  else if (num >= 0.0001 && num < 0.001) return num.toFixed(7) * 1
  else if (num >= 0.00001 && num < 0.0001) return num.toFixed(8) * 1
  else if (num >= 0.000001 && num < 0.00001) return num.toFixed(9) * 1
  else return num.toFixed(10) * 1
}

function NetWorkAnlysis(data) {
  // const data = JSON.parse(testdata)
  // console.log(Object.keys(data))
  // 计算allcombine

  const FromAll = {}
  FromAll.Import = []
  FromAll.ConsByPred = []
  FromAll.Export = []
  FromAll.ToDet = []
  FromAll.Respiration = []
  FromAll.Throughput = []
  // 计算DetThroughtputSum PPThroughtputSum
  let DetThroughtputSum = 0
  let PPThroughtputSum = 0
  for (let i = 0; i <= data.NoTL; i++) {
    if (i === 0) {
      FromAll.Import.push(0)
      FromAll.ConsByPred.push(0)
      FromAll.Export.push(0)
      FromAll.ToDet.push(0)
      FromAll.Respiration.push(0)
      FromAll.Throughput.push(0)
    } else {
      FromAll.Import.push(
        Retain_Decimals(data.FromPP.PPImport[i] + data.FromDet.DetImport[i]),
      )
      FromAll.ConsByPred.push(
        Retain_Decimals(
          data.FromPP.PPConsByPred[i] + data.FromDet.DetConsByPred[i],
        ),
      )
      FromAll.Export.push(
        Retain_Decimals(data.FromPP.PPExport[i] + data.FromDet.DetExport[i]),
      )
      FromAll.ToDet.push(
        Retain_Decimals(data.FromPP.PPToDet[i] + data.FromDet.DetToDet[i]),
      )
      FromAll.Respiration.push(
        Retain_Decimals(
          data.FromPP.PPRespiration[i] + data.FromDet.DetRespiration[i],
        ),
      )
      FromAll.Throughput.push(
        Retain_Decimals(
          data.FromPP.PPThroughput[i] + data.FromDet.DetThroughput[i],
        ),
      )
      DetThroughtputSum += data.FromDet.DetThroughput[i]
      PPThroughtputSum += data.FromPP.PPThroughput[i]
    }
  }

  const FromEvery = []
  const names = [
    '0',
    'Ⅰ',
    'Ⅱ',
    'Ⅲ',
    'Ⅳ',
    'Ⅴ',
    'Ⅵ',
    'Ⅶ',
    'Ⅷ',
    'Ⅸ',
    'Ⅹ',
    'Ⅺ',
    'Ⅻ',
  ]
  for (let i = data.NoTL; i >= 1; i--) {
    const tmp = {}
    tmp.key = i
    tmp.TLFlow = names[i]
    tmp.Import_PP = data.FromPP.PPImport[i]
    tmp.Import_D = data.FromDet.DetImport[i]
    tmp.Import_All = FromAll.Import[i]
    tmp.CP_PP = data.FromPP.PPConsByPred[i]
    tmp.CP_D = data.FromDet.DetConsByPred[i]
    tmp.CP_All = FromAll.ConsByPred[i]
    tmp.Export_PP = data.FromPP.PPExport[i]
    tmp.Export_D = data.FromDet.DetExport[i]
    tmp.Export_All = FromAll.Export[i]
    tmp.FD_PP = data.FromPP.PPToDet[i]
    tmp.FD_D = data.FromDet.DetToDet[i]
    tmp.FD_All = FromAll.ToDet[i]
    tmp.Respiration_PP = data.FromPP.PPRespiration[i]
    tmp.Respiration_D = data.FromDet.DetRespiration[i]
    tmp.Respiration_All = FromAll.Respiration[i]
    tmp.Throughput_PP = data.FromPP.PPThroughput[i]
    tmp.Throughput_D = data.FromDet.DetThroughput[i]
    tmp.Throughput_All = FromAll.Throughput[i]
    FromEvery.push(tmp)
  }
  const nodes = []
  const edges = []
  for (let i = 1; i <= data.NoTL + 1; i++) {
    const tmp = {}
    const tmp2 = {}
    if (i === 1) {
      tmp.id = i.toString()
      tmp.title = 'P'
      tmp.TST = Retain_Decimals(
        (data.FromPP.PPThroughput[i] * 100) /
          (DetThroughtputSum + PPThroughtputSum),
      )
      tmp.biomass = Retain_Decimals(data.BbyTL[i])
      tmp.x = 100
      tmp.y = 100

      tmp2.source = i.toString()
      tmp2.target = (i + 1).toString()
      tmp2.predation = Retain_Decimals(data.FromPP.PPConsByPred[i])
      tmp2.type = 'lineTwoText'
      edges.push(tmp2)
    } else if (i === data.NoTL + 1) {
      tmp.id = i.toString()
      tmp.title = 'D'
      tmp.TST = Retain_Decimals(
        (data.FromDet.DetThroughput[1] * 100) /
          (DetThroughtputSum + PPThroughtputSum),
      )
      tmp.biomass = Retain_Decimals(data.Basic_Estimate.slice(-1)[0].Biomass)
      tmp.x = 100
      tmp.y = 250
    } else {
      tmp.id = i.toString()
      tmp.title = names[i]
      tmp.TST = Retain_Decimals(
        ((data.FromPP.PPThroughput[i] + data.FromDet.DetThroughput[i]) * 100) /
          (DetThroughtputSum + PPThroughtputSum),
      )
      tmp.biomass = Retain_Decimals(data.BbyTL[i])
      tmp.respiration = Retain_Decimals(FromAll.Respiration[i])
      tmp.exports = Retain_Decimals(FromAll.Export[i])
      tmp.x = 100 * (2 * i - 1)
      tmp.y = 100

      // 跳过9那一次
      if (i !== data.NoTL) {
        tmp2.source = i.toString()
        tmp2.target = (i + 1).toString()
        tmp2.predation = Retain_Decimals(
          data.FromPP.PPConsByPred[i] + data.FromDet.DetConsByPred[i],
        )
        if (FromAll.Throughput[i] > 0) {
          tmp2.TE = Retain_Decimals(
            (data.FromPP.PPCA[i] +
              data.FromDet.DetCAD[i] +
              FromAll.ConsByPred[i]) /
              FromAll.Throughput[i],
          )
        } else {
          tmp2.TE = 0
        }
        tmp2.type = 'lineTwoText'
        edges.push(tmp2)
      }
    }
    nodes.push(tmp)
  }

  for (let i = 2; i <= data.NoTL; i++) {
    const tmp = {}
    tmp.source = i.toString()
    tmp.target = (data.NoTL + 1).toString()
    tmp.flowtodet = Retain_Decimals(FromAll.ToDet[i])
    tmp.type = 'line-arrow'
    edges.push(tmp)
  }

  edges.push({
    source: '1',
    target: (data.NoTL + 1).toString(),
    flowtodet: Retain_Decimals(FromAll.ToDet[1]),
    type: 'lineTwoText2',
  })
  // D
  edges.push({
    source: (data.NoTL + 1).toString(),
    target: '2',
    style: {
      endArrow: {
        path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
        fill: '#F6BD16',
      },
      stroke: '#F6BD16',
    },
    label: Retain_Decimals(data.FromDet.DetConsByPred[1]),
  })

  return { nodes, edges, fromevery: FromEvery }
}

function SwitchEcoSim(
  data,
  stack,
  id,
  year,
  MeasuredFlag = false,
  MeasuredData = [],
) {
  // 时间轴
  const num = Object.values(data)[0].length
  // let year = 1970
  const time = []
  for (let i = 1; i <= num; i++) {
    time.push(year)
    year += 1
  }
  const GroupsColor = {}
  Object.keys(data).forEach((el, index) => {
    GroupsColor[el] = colorpanel[index]
  })
  const series = []
  Object.keys(data).forEach((el, index) => {
    // 是否是面积堆叠图
    if (stack) {
      series.push({
        stack: 'Total',
        areaStyle: {},
        name: el,
        data: data[el],
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          // 'color' :GroupsColor[el],
          width: 1,
        },
      })
    } else {
      series.push({
        name: el,
        data: data[el],
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          // 'color' :GroupsColor[el],
          width: 1,
        },
      })
      if (MeasuredFlag) {
        series.push({
          name: el,
          data: MeasuredData[index],
          type: 'scatter',
        })
      }
    }
  })
  const option = {
    id,
    color: colorpanel, // 在这设置画板，就不会使用内置的7，8种颜色，同时图形颜色和图例也会变了
    grid: {
      left: '5%',
      right: '20%',
    },
    legend: {
      show: true,
      type: 'scroll',
      orient: 'vertical',
      icon: 'rect',
      right: '2%',
    },
    xAxis: {
      type: 'category',
      data: time,
    },
    yAxis: {
      type: 'value',
    },
    series,
  }
  return option
}

function SwitchGroupPlot12(data, GroupFleetColor, year) {
  // 时间轴
  const num = data.Biomass.length
  // let year = 1970
  const time = []
  for (let i = 1; i <= num; i++) {
    time.push(year)
    year += 1
  }
  const series = []
  // Biomass
  series.push({
    name: 'Biomass',
    data: data.Biomass,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 0,
    yAxisIndex: 0,
    lineStyle: {
      color: GroupFleetColor[data.GroupName],
      width: 1,
    },
  })
  // ConsumpBiomass
  series.push({
    name: 'ConsumpBiomass',
    data: data.ConsumpBiomass,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 1,
    yAxisIndex: 1,
    lineStyle: {
      color: GroupFleetColor[data.GroupName],
      width: 1,
    },
  })
  // FeedingTime
  series.push({
    name: 'FeedingTime',
    data: data.FeedingTime,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 2,
    yAxisIndex: 2,
    lineStyle: {
      color: GroupFleetColor[data.GroupName],
      width: 1,
    },
  })
  // P/B predator mort fish mort
  series.push({
    name: 'P/B predator mort fish mort',
    data: data.TotalMort,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 3,
    yAxisIndex: 3,
    lineStyle: {
      color: 'black',
      width: 1,
    },
  })
  series.push({
    name: 'P/B predator mort fish mort',
    data: data.PredMort,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 3,
    yAxisIndex: 3,
    lineStyle: {
      color: 'red',
      width: 1,
    },
  })
  series.push({
    name: 'P/B predator mort fish mort',
    data: data.FishMort,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 3,
    yAxisIndex: 3,
    lineStyle: {
      color: 'blue',
      width: 1,
    },
  })
  // Predation Mortality
  data.PredationMortality.forEach((el, index) => {
    series.push({
      name: 'Predation Mortality',
      data: el,
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 4,
      yAxisIndex: 4,
      lineStyle: {
        color: GroupFleetColor[data.Predatorsranked[index].Name],
        width: 1,
      },
    })
  })
  // Prey
  data.Prey.forEach((el, index) => {
    series.push({
      name: 'Prey',
      data: el,
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 5,
      yAxisIndex: 5,
      lineStyle: {
        color: GroupFleetColor[data.Preyranked[index].Name],
        width: 1,
      },
    })
  })
  // 与Fleet相关的
  for (i = 1; i <= data.Fleets.length; i++) {
    // Catch
    series.push({
      // 'stack': 'Total',
      // 'areaStyle': {},
      name: 'Catch',
      data: data.CatchByFleet[i],
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 6,
      yAxisIndex: 6,
      lineStyle: {
        color: GroupFleetColor[data.Fleets[i - 1].Name],
        width: 1,
      },
    })
    // FishingMortByFleet
    series.push({
      // 'stack': 'Total',
      // 'areaStyle': {},
      name: 'FishingMortByFleet',
      data: data.FishingMortByFleet[i],
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 7,
      yAxisIndex: 7,
      lineStyle: {
        color: GroupFleetColor[data.Fleets[i - 1].Name],
        width: 1,
      },
    })
    // Total Discard
    series.push({
      // 'stack': 'Total',
      // 'areaStyle': {},
      name: 'DiscardByFleet',
      data: data.DiscardByFleet[i],
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 8,
      yAxisIndex: 8,
      lineStyle: {
        color: GroupFleetColor[data.Fleets[i - 1].Name],
        width: 1,
      },
    })
    // DiscardMortByFleet
    series.push({
      // 'stack': 'Total',
      // 'areaStyle': {},
      name: 'DiscardMortByFleet',
      data: data.DiscardMortByFleet[i],
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 9,
      yAxisIndex: 9,
      lineStyle: {
        color: GroupFleetColor[data.Fleets[i - 1].Name],
        width: 1,
      },
    })
    // DiscardSurvivedByFleet
    series.push({
      // 'stack': 'Total',
      // 'areaStyle': {},
      name: 'DiscardSurvivedByFleet',
      data: data.DiscardSurvivedByFleet[i],
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 10,
      yAxisIndex: 10,
      lineStyle: {
        color: GroupFleetColor[data.Fleets[i - 1].Name],
        width: 1,
      },
    })
    // Landings
    series.push({
      // 'stack': 'Total',
      // 'areaStyle': {},
      name: 'LandingsByFleet',
      data: data.LandingsByFleet[i],
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 11,
      yAxisIndex: 11,
      lineStyle: {
        color: GroupFleetColor[data.Fleets[i - 1].Name],
        width: 1,
      },
    })
  }
  const myxAxis = []
  const myyAxis = []
  for (i = 0; i < 12; i++) {
    myxAxis.push({
      gridIndex: i,
      data: time,
      name: GroupPlotName12[i],
      nameLocation: 'middle',
      nameTextStyle: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 48,
      },
      splitLine: {
        show: false,
      },
    })
    myyAxis.push({
      gridIndex: i,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    })
  }
  const option = {
    id: data.GroupName,
    grid: [
      { left: '2%', top: '7%', width: '18%', height: '20%' },
      { left: '27%', top: '7%', width: '18%', height: '20%' },
      { left: '52%', top: '7%', width: '18%', height: '20%' },
      { left: '76%', top: '7%', width: '18%', height: '20%' },
      { left: '2%', top: '38%', width: '18%', height: '20%' },
      { left: '27%', top: '38%', width: '18%', height: '20%' },
      { left: '52%', top: '38%', width: '18%', height: '20%' },
      { left: '76%', top: '38%', width: '18%', height: '20%' },
      { left: '2%', top: '71%', width: '18%', height: '20%' },
      { left: '27%', top: '71%', width: '18%', height: '20%' },
      { left: '52%', top: '71%', width: '18%', height: '20%' },
      { left: '76%', top: '71%', width: '18%', height: '20%' },
    ],
    title: {
      text: data.GroupName,
      left: 'center',
      top: 0,
    },
    xAxis: myxAxis,
    yAxis: myyAxis,
    series,
  }
  return option
}
function SwitchGroupPlot(data, GroupFleetColor, year) {
  // 时间轴
  const num = data.Biomass.length
  // let year = 1970
  const time = []
  for (let i = 1; i <= num; i++) {
    time.push(year)
    year += 1
  }
  const series = []
  // Biomass
  series.push({
    name: 'Biomass',
    data: data.Biomass,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 0,
    yAxisIndex: 0,
    lineStyle: {
      color: GroupFleetColor[data.GroupName],
      width: 1,
    },
  })
  // ConsumpBiomass
  series.push({
    name: 'ConsumpBiomass',
    data: data.ConsumpBiomass,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 1,
    yAxisIndex: 1,
    lineStyle: {
      color: GroupFleetColor[data.GroupName],
      width: 1,
    },
  })
  // P/B predator mort fish mort
  series.push({
    name: 'P/B predator mort fish mort',
    data: data.TotalMort,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 2,
    yAxisIndex: 2,
    lineStyle: {
      color: 'black',
      width: 1,
    },
  })
  series.push({
    name: 'P/B predator mort fish mort',
    data: data.PredMort,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 2,
    yAxisIndex: 2,
    lineStyle: {
      color: 'red',
      width: 1,
    },
  })
  series.push({
    name: 'P/B predator mort fish mort',
    data: data.FishMort,
    type: 'line',
    smooth: true,
    symbol: 'none',
    xAxisIndex: 2,
    yAxisIndex: 2,
    lineStyle: {
      color: 'blue',
      width: 1,
    },
  })
  // Prey
  data.Prey.forEach((el, index) => {
    series.push({
      name: 'Prey',
      data: el,
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 3,
      yAxisIndex: 3,
      lineStyle: {
        color: GroupFleetColor[data.Preyranked[index].Name],
        width: 1,
      },
    })
  })
  // 与Fleet相关的
  for (let i = 1; i <= data.Fleets.length; i++) {
    // Catch
    series.push({
      // 'stack': 'Total',
      // 'areaStyle': {},
      name: 'Catch',
      data: data.CatchByFleet[i],
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 4,
      yAxisIndex: 4,
      lineStyle: {
        color: GroupFleetColor[data.Fleets[i - 1].Name],
        width: 1,
      },
    })
  }

  const myxAxis = []
  const myyAxis = []
  for (let i = 0; i < 5; i++) {
    myxAxis.push({
      gridIndex: i,
      data: time,
      name: GroupPlotName[i],
      nameLocation: 'middle',
      nameTextStyle: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 48,
      },
      splitLine: {
        show: false,
      },
    })
    myyAxis.push({
      gridIndex: i,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    })
  }
  if (data.AverageWeight !== null) {
    series.push({
      name: 'Average Weight',
      data: data.AverageWeight,
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 5,
      yAxisIndex: 5,
      lineStyle: {
        color: GroupFleetColor[data.GroupName],
        width: 1,
      },
    })
    myxAxis.push({
      gridIndex: 5,
      data: time,
      name: 'Average Weight',
      nameLocation: 'middle',
      nameTextStyle: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 48,
      },
      splitLine: {
        show: false,
      },
    })
    myyAxis.push({
      gridIndex: 5,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    })
  } else {
    series.push({
      name: 'ProdConsump',
      data: data.ProdConsump,
      type: 'line',
      smooth: true,
      symbol: 'none',
      xAxisIndex: 5,
      yAxisIndex: 5,
      lineStyle: {
        color: GroupFleetColor[data.GroupName],
        width: 1,
      },
    })
    myxAxis.push({
      gridIndex: 5,
      data: time,
      name: 'Production/Consumption',
      nameLocation: 'middle',
      nameTextStyle: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 48,
      },
      splitLine: {
        show: false,
      },
    })
    myyAxis.push({
      gridIndex: 5,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    })
  }
  const option = {
    id: data.GroupName,
    grid: [
      { left: '2%', top: '7%', width: '25%', height: '35%' },
      { left: '34%', top: '7%', width: '25%', height: '35%' },
      { left: '67%', top: '7%', width: '25%', height: '35%' },

      { left: '2%', top: '57%', width: '25%', height: '35%' },
      { left: '34%', top: '57%', width: '25%', height: '35%' },
      { left: '67%', top: '57%', width: '25%', height: '35%' },
    ],
    title: {
      text: data.GroupName,
      left: 'center',
      top: 0,
    },
    xAxis: myxAxis,
    yAxis: myyAxis,
    series,
  }
  return option
}
// 对Predatorsranked Preyranked Fleets进行排序，并赋予颜色以便于前端显示
function SwitchGroupPlotColor(data, GroupFleetColor) {
  // 排序
  data.Predatorsranked.sort(function (a, b) {
    return b.rankvalue - a.rankvalue
  })
  data.Predatorsranked.forEach((el) => {
    el.color = GroupFleetColor[el.Name]
  })
  data.Preyranked.sort(function (a, b) {
    return b.rankvalue - a.rankvalue
  })
  data.Preyranked.forEach((el) => {
    el.color = GroupFleetColor[el.Name]
  })
  data.Fleets.sort(function (a, b) {
    return b.rankvalue - a.rankvalue
  })
  data.Fleets.forEach((el) => {
    el.color = GroupFleetColor[el.Name]
  })
  return {
    Predatorsranked: data.Predatorsranked,
    Preyranked: data.Preyranked,
    Fleets: data.Fleets,
  }
}

function SwitchFleetPlot(data, GroupFleetColor, year) {
  // 时间轴
  const num = data.CatchByFleet[1].length
  // let year = 1970
  const time = []
  for (let i = 1; i <= num; i++) {
    time.push(year)
    year += 1
  }
  const series = []
  let colorNum = 0
  let forlength = 0
  forlength = data.CatchByFleet.length
  // Catch
  for (let i = 1; i < forlength; i++) {
    if (data.CatchByFleet[i].length !== 0) {
      series.push({
        name: 'Catch',
        data: data.CatchByFleet[i],
        type: 'line',
        smooth: true,
        symbol: 'none',
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: {
          color: GroupFleetColor[data.Groups[colorNum].Name],
          width: 1,
        },
      })
      colorNum += 1
    } else {
      continue
    }
  }
  // F fishing mortality
  colorNum = 0
  for (let i = 1; i < forlength; i++) {
    if (data.FishingMortByFleet[i].length !== 0) {
      series.push({
        name: 'FishingMortByFleet',
        data: data.FishingMortByFleet[i],
        type: 'line',
        smooth: true,
        symbol: 'none',
        xAxisIndex: 1,
        yAxisIndex: 1,
        lineStyle: {
          color: GroupFleetColor[data.Groups[colorNum].Name],
          width: 1,
        },
      })
      colorNum += 1
    } else {
      continue
    }
  }
  // Landing
  colorNum = 0
  for (let i = 1; i < forlength; i++) {
    if (data.LandingsByFleet[i].length !== 0) {
      series.push({
        name: 'LandingsByFleet',
        data: data.LandingsByFleet[i],
        type: 'line',
        smooth: true,
        symbol: 'none',
        xAxisIndex: 2,
        yAxisIndex: 2,
        lineStyle: {
          color: GroupFleetColor[data.Groups[colorNum].Name],
          width: 1,
        },
      })
      colorNum += 1
    } else {
      continue
    }
  }
  // DiscardByFleet
  colorNum = 0
  for (let i = 1; i < forlength; i++) {
    if (data.DiscardByFleet[i].length !== 0) {
      series.push({
        name: 'DiscardByFleet',
        data: data.DiscardByFleet[i],
        type: 'line',
        smooth: true,
        symbol: 'none',
        xAxisIndex: 3,
        yAxisIndex: 3,
        lineStyle: {
          color: GroupFleetColor[data.Groups[colorNum].Name],
          width: 1,
        },
      })
      colorNum += 1
    } else {
      continue
    }
  }
  // DiscardMortByFleet
  colorNum = 0
  for (let i = 1; i < forlength; i++) {
    if (data.DiscardMortByFleet[i].length !== 0) {
      series.push({
        name: 'DiscardMortByFleet',
        data: data.DiscardMortByFleet[i],
        type: 'line',
        smooth: true,
        symbol: 'none',
        xAxisIndex: 4,
        yAxisIndex: 4,
        lineStyle: {
          color: GroupFleetColor[data.Groups[colorNum].Name],
          width: 1,
        },
      })
      colorNum += 1
    } else {
      continue
    }
  }
  // DiscardSurvivedByFleet
  colorNum = 0
  for (let i = 1; i < forlength; i++) {
    if (data.DiscardSurvivedByFleet[i].length !== 0) {
      series.push({
        name: 'DiscardSurvivedByFleet',
        data: data.DiscardSurvivedByFleet[i],
        type: 'line',
        smooth: true,
        symbol: 'none',
        xAxisIndex: 5,
        yAxisIndex: 5,
        lineStyle: {
          color: GroupFleetColor[data.Groups[colorNum].Name],
          width: 1,
        },
      })
      colorNum += 1
    } else {
      continue
    }
  }
  const myxAxis = []
  const myyAxis = []
  for (let i = 0; i < 6; i++) {
    myxAxis.push({
      gridIndex: i,
      data: time,
      name: FleetPlotName[i],
      nameLocation: 'middle',
      nameTextStyle: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 48,
      },
      splitLine: {
        show: false,
      },
    })
    myyAxis.push({
      gridIndex: i,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    })
  }
  const option = {
    id: data.FleetName,
    grid: [
      { left: '4%', top: '7%', width: '25%', height: '35%' },
      { left: '35%', top: '7%', width: '25%', height: '35%' },
      { left: '65%', top: '7%', width: '25%', height: '35%' },
      { left: '4%', top: '55%', width: '25%', height: '35%' },
      { left: '35%', top: '55%', width: '25%', height: '35%' },
      { left: '65%', top: '55%', width: '25%', height: '35%' },
    ],
    title: {
      text: data.FleetName,
      left: 'center',
      top: 0,
    },
    xAxis: myxAxis,
    yAxis: myyAxis,
    series,
  }
  return option
}
// 对Groups进行排序，并赋予颜色以便于前端显示
function SwitchFleetPlotColor(data, GroupFleetColor) {
  data.Groups.sort(function (a, b) {
    return b.rankvalue - a.rankvalue
  })
  data.Groups.forEach((el) => {
    el.color = GroupFleetColor[el.Name]
  })
  return data.Groups
}

function SwitchEcoSpace(data, data2, id, year) {
  // 时间轴
  const num = data[0].length - 1
  // let year = 1970
  const time = []
  for (let i = 1; i <= num / 3; i++) {
    let month = 1
    for (let j = 0; j < 3; j++) {
      time.push(year + '.' + month)
      month += 5
    }
    year += 1
  }
  const series = []
  // 受EWE软件的影响，从一开始计数
  for (let i = 1; i < data.length; i++) {
    series.push({
      name: data2[i - 1].Group_name,
      data: data[i].slice(1), // 受EWE软件的影响，从一开始计数
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: {
        // 'color' :GroupsColor[el],
        width: 1,
      },
    })
  }
  const option = {
    id,
    color: colorpanel, // 在这设置画板，就不会使用内置的7，8种颜色，同时图形颜色和图例也会变了
    grid: {
      left: '5%',
      right: '20%',
    },
    legend: {
      show: true,
      type: 'scroll',
      orient: 'vertical',
      icon: 'rect',
      right: '2%',
    },
    xAxis: {
      type: 'category',
      data: time,
    },
    yAxis: {
      type: 'value',
    },
    series,
  }
  return option
}

const test_get = (request, response) => {
  response.send('Hello Express')
}

// Uplaod
const UploadTimeseries = async (req, res) => {
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  const csvpath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.csvname
  const output = execSync(
    `cd "${exeFilePath}" && ConsoleApp2.exe "${ewefilepath}" "ImportCSV" "${outfilepath}" "${csvpath}" "Annual"`,
  )
  // //EcoSim输入相关 TimeSeries
  const TimeSelect = []
  try {
    fs.accessSync(outfilepath + '\\' + 'EcoSimInput.json')
    const ESdata = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcoSimInput.json', 'utf-8'),
    )
    Object.keys(ESdata.TimeSeries).forEach((item) => {
      TimeSelect.push({ value: item, label: item })
    })
    ESdata.TimeSelect = TimeSelect
    return { status: 'success', EcoSim: ESdata }
  } catch (err) {
    console.log('EcoSimInput文件不存在')
    return { EcoSim: {} }
  }
}
const UploadForcing = async (req, res) => {
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  const csvpath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.csvname
  const output = execSync(
    `cd "${exeFilePath}" && ConsoleApp2.exe "${ewefilepath}" "ImportCSV" "${outfilepath}" "${csvpath}" "TimeStep"`,
  )
  // EcoSim输入相关 TimeSeries
  const TimeSelect = []
  try {
    fs.accessSync(outfilepath + '\\' + 'EcoSimInput.json')
    const ESdata = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcoSimInput.json', 'utf-8'),
    )
    Object.keys(ESdata.TimeSeries).forEach((item) => {
      TimeSelect.push({ value: item, label: item })
    })
    ESdata.TimeSelect = TimeSelect
    return { status: 'success', EcoSim: ESdata }
  } catch (err) {
    console.log('EcoSimInput文件不存在')
    return { EcoSim: {} }
  }
}
const UploadMeasured = async (req, res) => {
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  const csvpath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.csvname

  let index = 0
  const series = []
  const data = []
  // 读取CSV文件
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvpath)
      .pipe(csv.parse({ headers: false }))
      .on('data', (row) => {
        if (index === 0) {
          for (let i = 1; i < row.length; i++) {
            series.push({
              name: row[i] + i,
              type: 'scatter',
              itemStyle: { color: colorpanel[i] },
            })
            data.push([])
          }
        }

        if (index >= 4) {
          data.forEach((innerArray, i) => {
            innerArray.push([6 + 12 * (index - 4), row[i + 1]])
          })
        }
        index += 1
      })
      .on('end', () => {
        const jsonData = JSON.stringify(data, null, 2)
        fs.writeFileSync(outfilepath + '\\Measured.json', jsonData)
        console.log('数据已保存到 Measured.json 文件')
        for (let i = 0; i < series.length; i++) {
          series[i].data = data[i]
        }
        console.log('CSV文件读取完毕')
        resolve({ status: 'success', series })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

const Load_Model = async (req, res) => {
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  try {
    // const output = execSync(
    //   `cd "${exeFilePath}"&& ConsoleApp2.exe "${ewefilepath}" "Import" "${outfilepath}"`,
    // )
    // const outputString = output.toString();
    // console.log(outputString)
    // 处理执行命令后的结果
    const data = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'Import_Data.json', 'utf-8'),
    )
    const StanzeSelect = []
    Object.keys(data.StanzeGroup).forEach((item) => {
      StanzeSelect.push({ value: item, label: item })
    })
    data.StanzeSelect = StanzeSelect

    // Stanze画图option
    StanzePlotOption(data.StanzeGroup)

    let EspaceData = {};
    //fs.access是一个异步方法。当调用这个方法时，Node.js将继续执行代码，而不会等到文件检查完成
    try {
        fs.accessSync(outfilepath+"\\"+'EcoSpaceInput.json');
        console.log("EcoSpaceInput.json文件存在");
        const EcospaceInput = JSON.parse(fs.readFileSync(outfilepath+"\\"+'EcoSpaceInput.json', 'utf-8'))
        EspaceData["Input"] = EcospaceInput
    } catch (err) {
        console.log("EcoSpaceInput.json文件不存在");
    }
    try {
        fs.accessSync(outfilepath+"\\"+'MapDepth.json');
        console.log("MapDepth.json文件存在");
        const DepthData = JSON.parse(fs.readFileSync(outfilepath+"\\"+'MapDepth.json', 'utf-8'))
        EspaceData["MapDepth"] = DepthData["MapDepth"]
        EspaceData["MapHabitat"] = DepthData["MapHabitat"]
    } catch (err) {
        console.log("MapDepth.json文件不存在");
    }
    try {
        fs.accessSync(outfilepath+"\\"+'MapDepthColor.json');
        console.log("MapDepthColor文件存在");
        const MapDepthColor = JSON.parse(fs.readFileSync(outfilepath+"\\"+'MapDepthColor.json', 'utf-8'))
        EspaceData["MapDepthColor"] = MapDepthColor
    } catch (err) {
        console.log("MapDepthColor文件不存在");
    }
    try {
        fs.accessSync(outfilepath+"\\"+'ModelParameters.json');
        console.log("ModelParameters文件存在");
        const ModelParameters = JSON.parse(fs.readFileSync(outfilepath+"\\"+'ModelParameters.json', 'utf-8'))
        EspaceData["HabitType"] = ModelParameters.MapHabitatIndex
    } catch (err) {
        console.log("ModelParameters文件不存在");
    }
    // Flow
    try {
        fs.accessSync(outfilepath+"\\"+'MapFlow.json');
        console.log("MapFlow文件存在");
        const MapFlow = JSON.parse(fs.readFileSync(outfilepath+"\\"+'MapFlow.json', 'utf-8'))
        EspaceData["MapFlow"] = MapFlow["1"]
    } catch (err) {
        console.log("MapFlow文件不存在");
    }
    try {
        fs.accessSync(outfilepath+"\\"+'MapFlowColor.json');
        console.log("MapFlowColor文件存在");
        const MapFlowColor = JSON.parse(fs.readFileSync(outfilepath+"\\"+'MapFlowColor.json', 'utf-8'))
        EspaceData["MapFlowColor"] = MapFlowColor["1"]
    } catch (err) {
        console.log("MapFlowColor文件不存在");
    }

    // EcoSim输入相关 TimeSeries
    let ESdata = {}
    const TimeSelect = []
    try {
        fs.accessSync(outfilepath + '\\' + 'EcoSimInput.json')
        ESdata = JSON.parse(
          fs.readFileSync(outfilepath + '\\' + 'EcoSimInput.json', 'utf-8'),
        )
        Object.keys(ESdata.TimeSeries).forEach((item) => {
          TimeSelect.push({ value: item, label: item })
        })
        ESdata.TimeSelect = TimeSelect
    } 
    catch (err) {
      console.log('EcoSimInput文件不存在')
    }
    // RUn之后产生的文件
    const result = {}
    try {
      /// /////////////////////EcoPath////////////////////////////////////////
      // 处理执行命令后的结果
      const data = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'EcopathOutput.json', 'utf-8'),
      )
      const FlowDiagramD = FlowDiagram(data.PreNode, data.Link)
      const LindmanSpine = NetWorkAnlysis(data)
      result.EcoPath = {
        Basic_Estimate: data.Basic_Estimate,
        FlowDiagram: FlowDiagramD,
        LindmanSpine,
        Mortality: data.Mortality,
        MixedTrophic: data.MixedTrophicImpacts,
      }
      /// /////////////////////EcoSim////////////////////////////////////////
      // 处理执行命令后的结果
      const EcoSim_data = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'EcoSim_Result.json', 'utf-8'),
      )
      const RunEcoSimPlot = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'RunEcosim_Plot.json', 'utf-8'),
      )
      const EcoSimGroupPlot = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'EcoSim_Group_Plots.json', 'utf-8'),
      )
      const EcoSimFleetPlot = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'EcoSim_Fleet_Plots.json', 'utf-8'),
      )
      const ModelParameters = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'ModelParameters.json', 'utf-8'),
      )
      // 通过EcoSim——Result获得种类对应的颜色
      const GroupFleetColor = {}
      const GroupColor = {}
      const FleetColor = {}
      EcoSim_data.EcoSim_Result_Group.forEach((el, index) => {
        if (index < EcoSimGroupPlot.EcoSim_Group_Plots.length) {
          GroupFleetColor[el.Group_name] = colorpanel[index]
          GroupColor[el.Group_name] = colorpanel[index]
        }
      })
      EcoSim_data.EcoSim_Result_Fleet.forEach((el, index) => {
        GroupFleetColor[el.Fleet_name] =
          colorpanel[index + EcoSim_data.EcoSim_Result_Group.length]
        FleetColor[el.Fleet_name] =
          colorpanel[index + EcoSim_data.EcoSim_Result_Group.length]
      })
      // RunEcoSim里面的图画
      let MeasuredFlag = false
      let MeasuredData = []
      // fs.access是一个异步方法。当调用这个方法时，Node.js将继续执行代码，而不会等到文件检查完成
      try {
        fs.accessSync(outfilepath + '\\' + 'Measured.json')
        console.log('Measured.json文件存在')
        MeasuredData = JSON.parse(
          fs.readFileSync(outfilepath + '\\' + 'Measured.json', 'utf-8'),
        )
        MeasuredFlag = true
      } catch (err) {
        console.log('Measured.json文件不存在')
        MeasuredFlag = false
      }
      const option = SwitchEcoSim(
        RunEcoSimPlot.Biomass_relative,
        false,
        'Biomass_relative',
        ModelParameters.StartTime,
        false,
        MeasuredData,
      )
      EcoSim_data.option = option
      const option_validate = SwitchEcoSim(
        RunEcoSimPlot.Biomass_relative,
        false,
        'Biomass_relative_validate',
        ModelParameters.StartTime,
        MeasuredFlag,
        MeasuredData,
      )
      EcoSim_data.option_validate = option_validate
      const GroupPlotOption = SwitchGroupPlot(
        EcoSimGroupPlot.EcoSim_Group_Plots[0],
        GroupFleetColor,
        ModelParameters.StartTime,
      )
      const GroupPlotColor = SwitchGroupPlotColor(
        EcoSimGroupPlot.EcoSim_Group_Plots[0],
        GroupFleetColor,
      )
      EcoSim_data.GroupPlot = {
        Option: GroupPlotOption,
        Color: GroupPlotColor,
        GroupColor,
      }
      const FleetPlotOption = SwitchFleetPlot(
        EcoSimFleetPlot.EcoSim_Fleet_Plots[0],
        GroupFleetColor,
        ModelParameters.StartTime,
      )
      const FleetPlotColor = SwitchFleetPlotColor(
        EcoSimFleetPlot.EcoSim_Fleet_Plots[0],
        GroupFleetColor,
      )
      EcoSim_data.FleetPlot = {
        Option: FleetPlotOption,
        Color: FleetPlotColor,
        FleetColor,
      }
      result.EcoSim = EcoSim_data
      /// /////////////////////EcoSpace////////////////////////////////////////
      try {
        let EcoSpace_Result = JSON.parse(fs.readFileSync(outfilepath+"\\"+'EcoSpace_Result_'+ Modeltype[0] +'.json', 'utf-8'))
        let DataPlot = JSON.parse(fs.readFileSync(outfilepath+"\\"+'RunEcoSpace_Plot_'+ Modeltype[0] +'.json', 'utf-8'))
        // 从Import里面拿数据名称
        let Import = JSON.parse(fs.readFileSync(outfilepath+"\\"+'Import_Data.json', 'utf-8'))
        // let ModelParameters = JSON.parse(fs.readFileSync(outfilepath+"\\"+'ModelParameters.json', 'utf-8'))
        let SelectOption = []
        Import.Basic_Input.forEach((el,index)=>{
            SelectOption.push({"label":el.GroupName,"value":index+1})
        })
        let Option = SwitchEcoSpace(DataPlot.Relative_Biomass,EcoSpace_Result.EcoSpace_Result_Group,"Relative_Biomass",ModelParameters.StartTime);
        let RunEcoSpace_Map = JSON.parse(fs.readFileSync(outfilepath+"\\"+'RunEcoSpace_MapColor_'+ Modeltype[0] +'.json', 'utf-8'))
        result.EcoSpace = {
          ResultData:EcoSpace_Result,
          option:Option,
          SelectOption:SelectOption,
          FirstResultMap:{id:SelectOption[0].value,
          data:RunEcoSpace_Map["1"][0]},
          Time:ModelParameters.EcoSpaceTime
        }
      } catch (err) {
        console.log('EcoSpace文件不存在')
        result.EcoSpace = {}
      }
    } catch (error) {
      // 处理异常情况
      console.log('RUn之后产生的文件不存在')
    }
    return {
      status: 'success',
      EcoPath: data,
      EcoSpace: EspaceData,
      EcoSim: ESdata,
      Output: result
    }
  } catch (error) {
    // 处理异常情况
    return { status: 'error', message: 'Mloading' }
  }
  
}

const Import_Model = async (req, res) => {
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  try {
    const output = execSync(
      `cd "${exeFilePath}"&& ConsoleApp2.exe "${ewefilepath}" "Import" "${outfilepath}"`,
    )
    // const outputString = output.toString();
    // console.log(outputString)
    // 处理执行命令后的结果
    const data = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'Import_Data.json', 'utf-8'),
    )
    const StanzeSelect = []
    Object.keys(data.StanzeGroup).forEach((item) => {
      StanzeSelect.push({ value: item, label: item })
    })
    data.StanzeSelect = StanzeSelect

    // Stanze画图option
    StanzePlotOption(data.StanzeGroup)

    let EspaceData = {};
    //fs.access是一个异步方法。当调用这个方法时，Node.js将继续执行代码，而不会等到文件检查完成
    try {
        fs.accessSync(outfilepath+"\\"+'EcoSpaceInput.json');
        console.log("EcoSpaceInput.json文件存在");
        const EcospaceInput = JSON.parse(fs.readFileSync(outfilepath+"\\"+'EcoSpaceInput.json', 'utf-8'))
        EspaceData["Input"] = EcospaceInput
    } catch (err) {
        console.log("EcoSpaceInput.json文件不存在");
    }
    try {
        fs.accessSync(outfilepath+"\\"+'MapDepth.json');
        console.log("MapDepth.json文件存在");
        const DepthData = JSON.parse(fs.readFileSync(outfilepath+"\\"+'MapDepth.json', 'utf-8'))
        EspaceData["MapDepth"] = DepthData["MapDepth"]
        EspaceData["MapHabitat"] = DepthData["MapHabitat"]
    } catch (err) {
        console.log("MapDepth.json文件不存在");
    }
    try {
        fs.accessSync(outfilepath+"\\"+'MapDepthColor.json');
        console.log("MapDepthColor文件存在");
        const MapDepthColor = JSON.parse(fs.readFileSync(outfilepath+"\\"+'MapDepthColor.json', 'utf-8'))
        EspaceData["MapDepthColor"] = MapDepthColor
    } catch (err) {
        console.log("MapDepthColor文件不存在");
    }
    try {
        fs.accessSync(outfilepath+"\\"+'ModelParameters.json');
        console.log("ModelParameters文件存在");
        const ModelParameters = JSON.parse(fs.readFileSync(outfilepath+"\\"+'ModelParameters.json', 'utf-8'))
        EspaceData["HabitType"] = ModelParameters.MapHabitatIndex
    } catch (err) {
        console.log("ModelParameters文件不存在");
    }
    // Flow
    try {
        fs.accessSync(outfilepath+"\\"+'MapFlow.json');
        console.log("MapFlow文件存在");
        const MapFlow = JSON.parse(fs.readFileSync(outfilepath+"\\"+'MapFlow.json', 'utf-8'))
        EspaceData["MapFlow"] = MapFlow["1"]
    } catch (err) {
        console.log("MapFlow文件不存在");
    }
    try {
        fs.accessSync(outfilepath+"\\"+'MapFlowColor.json');
        console.log("MapFlowColor文件存在");
        const MapFlowColor = JSON.parse(fs.readFileSync(outfilepath+"\\"+'MapFlowColor.json', 'utf-8'))
        EspaceData["MapFlowColor"] = MapFlowColor["1"]
    } catch (err) {
        console.log("MapFlowColor文件不存在");
    }

    // EcoSim输入相关 TimeSeries
    const TimeSelect = []
    try {
      fs.accessSync(outfilepath + '\\' + 'EcoSimInput.json')
      const ESdata = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'EcoSimInput.json', 'utf-8'),
      )
      Object.keys(ESdata.TimeSeries).forEach((item) => {
        TimeSelect.push({ value: item, label: item })
      })
      ESdata.TimeSelect = TimeSelect
      return {
        status: 'success',
        EcoPath: data,
        EcoSpace: EspaceData,
        EcoSim: ESdata,
      }
    } catch (err) {
      console.log('EcoSimInput文件不存在')
      return {
        status: 'error',
        message: 'Mloading',
        EcoPath: data,
        EcoSpace: EspaceData,
        EcoSim: {},
      }
    }
  } catch (error) {
    // 处理异常情况
    return { status: 'error', message: 'Mloading' }
  }
}

const Run_Model = async (req, res) => {
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  const result = {}
  try {
    /// /////////////////////EcoPath////////////////////////////////////////
    const output = execSync(
      `cd "${exeFilePath}"&& ConsoleApp2.exe "${ewefilepath}" "Run" "${outfilepath}"`,
    )
    // 处理执行命令后的结果
    const data = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcopathOutput.json', 'utf-8'),
    )
    const FlowDiagramD = FlowDiagram(data.PreNode, data.Link)
    const LindmanSpine = NetWorkAnlysis(data)
    result.EcoPath = {
      Basic_Estimate: data.Basic_Estimate,
      FlowDiagram: FlowDiagramD,
      LindmanSpine,
      Mortality: data.Mortality,
      MixedTrophic: data.MixedTrophicImpacts,
    }
    /// /////////////////////EcoSim////////////////////////////////////////
    // 处理执行命令后的结果
    const EcoSim_data = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcoSim_Result.json', 'utf-8'),
    )
    const RunEcoSimPlot = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'RunEcosim_Plot.json', 'utf-8'),
    )
    const EcoSimGroupPlot = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcoSim_Group_Plots.json', 'utf-8'),
    )
    const EcoSimFleetPlot = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcoSim_Fleet_Plots.json', 'utf-8'),
    )
    const ModelParameters = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'ModelParameters.json', 'utf-8'),
    )
    // 通过EcoSim——Result获得种类对应的颜色
    const GroupFleetColor = {}
    const GroupColor = {}
    const FleetColor = {}
    EcoSim_data.EcoSim_Result_Group.forEach((el, index) => {
      if (index < EcoSimGroupPlot.EcoSim_Group_Plots.length) {
        GroupFleetColor[el.Group_name] = colorpanel[index]
        GroupColor[el.Group_name] = colorpanel[index]
      }
    })
    EcoSim_data.EcoSim_Result_Fleet.forEach((el, index) => {
      GroupFleetColor[el.Fleet_name] =
        colorpanel[index + EcoSim_data.EcoSim_Result_Group.length]
      FleetColor[el.Fleet_name] =
        colorpanel[index + EcoSim_data.EcoSim_Result_Group.length]
    })
    // RunEcoSim里面的图画
    let MeasuredFlag = false
    let MeasuredData = []
    // fs.access是一个异步方法。当调用这个方法时，Node.js将继续执行代码，而不会等到文件检查完成
    try {
      fs.accessSync(outfilepath + '\\' + 'Measured.json')
      console.log('Measured.json文件存在')
      MeasuredData = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'Measured.json', 'utf-8'),
      )
      MeasuredFlag = true
    } catch (err) {
      console.log('Measured.json文件不存在')
      MeasuredFlag = false
    }
    const option = SwitchEcoSim(
      RunEcoSimPlot.Biomass_relative,
      false,
      'Biomass_relative',
      ModelParameters.StartTime,
      false,
      MeasuredData,
    )
    EcoSim_data.option = option
    const option_validate = SwitchEcoSim(
      RunEcoSimPlot.Biomass_relative,
      false,
      'Biomass_relative_validate',
      ModelParameters.StartTime,
      MeasuredFlag,
      MeasuredData,
    )
    EcoSim_data.option_validate = option_validate
    const GroupPlotOption = SwitchGroupPlot(
      EcoSimGroupPlot.EcoSim_Group_Plots[0],
      GroupFleetColor,
      ModelParameters.StartTime,
    )
    const GroupPlotColor = SwitchGroupPlotColor(
      EcoSimGroupPlot.EcoSim_Group_Plots[0],
      GroupFleetColor,
    )
    EcoSim_data.GroupPlot = {
      Option: GroupPlotOption,
      Color: GroupPlotColor,
      GroupColor,
    }
    const FleetPlotOption = SwitchFleetPlot(
      EcoSimFleetPlot.EcoSim_Fleet_Plots[0],
      GroupFleetColor,
      ModelParameters.StartTime,
    )
    const FleetPlotColor = SwitchFleetPlotColor(
      EcoSimFleetPlot.EcoSim_Fleet_Plots[0],
      GroupFleetColor,
    )
    EcoSim_data.FleetPlot = {
      Option: FleetPlotOption,
      Color: FleetPlotColor,
      FleetColor,
    }
    result.EcoSim = EcoSim_data
    /// /////////////////////EcoSpace////////////////////////////////////////
    const outputString = output.toString().trim()
    console.log(outputString)
    if(outputString.includes("NoneEcoSpace"))
    {
      result.EcoSpace = {}
    }
    else
    {
      let EcoSpace_Result = JSON.parse(fs.readFileSync(outfilepath+"\\"+'EcoSpace_Result_'+ Modeltype[req.body.modeltype] +'.json', 'utf-8'))
      let DataPlot = JSON.parse(fs.readFileSync(outfilepath+"\\"+'RunEcoSpace_Plot_'+ Modeltype[req.body.modeltype] +'.json', 'utf-8'))
      // 从Import里面拿数据名称
      let Import = JSON.parse(fs.readFileSync(outfilepath+"\\"+'Import_Data.json', 'utf-8'))
      // let ModelParameters = JSON.parse(fs.readFileSync(outfilepath+"\\"+'ModelParameters.json', 'utf-8'))
      let SelectOption = []
      Import.Basic_Input.forEach((el,index)=>{
          SelectOption.push({"label":el.GroupName,"value":index+1})
      })
      let Option = SwitchEcoSpace(DataPlot.Relative_Biomass,EcoSpace_Result.EcoSpace_Result_Group,"Relative_Biomass",ModelParameters.StartTime);
      let RunEcoSpace_Map = JSON.parse(fs.readFileSync(outfilepath+"\\"+'RunEcoSpace_MapColor_'+ Modeltype[req.body.modeltype] +'.json', 'utf-8'))
      result.EcoSpace = {
        ResultData:EcoSpace_Result,
        option:Option,
        SelectOption:SelectOption,
        FirstResultMap:{id:SelectOption[0].value,
        data:RunEcoSpace_Map["1"][0]},
        Time:ModelParameters.EcoSpaceTime
      }
    }
    result.status = 'success'
    result.message = 'Mloading'
    return result
  } catch (error) {
    // 处理异常情况
    return { status: 'error', message: 'Mloading' }
  }
}

const RunEcoPath = async (req, res) => {
  console.log('运行EcoPath')
  try {
    const output = execSync(
      `cd "${exeFilePath}"&& ConsoleApp2.exe "${filepath}" "EcoPath" "${outfilepath}"`,
    )
    // 处理执行命令后的结果
    const data = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcopathOutput.json', 'utf-8'),
    )
    const FlowDiagramD = FlowDiagram(data.PreNode, data.Link)
    const LindmanSpine = NetWorkAnlysis(data)
    return {
      Basic_Estimate: data.Basic_Estimate,
      FlowDiagram: FlowDiagramD,
      LindmanSpine,
      Mortality: data.Mortality,
      MixedTrophic: data.MixedTrophicImpacts,
    }
  } catch (error) {
    // 处理异常情况
  }
}

const RunEcoSim = async (req, res) => {
  console.log('运行EcoSim')
  try {
    const output = execSync(
      `cd "${exeFilePath}"&& ConsoleApp2.exe "${filepath}" "EcoSim" "${outfilepath}"`,
    )
    // 处理执行命令后的结果
    const data = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcoSim_Result.json', 'utf-8'),
    )
    const RunEcoSimPlot = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'RunEcosim_Plot.json', 'utf-8'),
    )
    const EcoSimGroupPlot = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcoSim_Group_Plots.json', 'utf-8'),
    )
    const EcoSimFleetPlot = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'EcoSim_Fleet_Plots.json', 'utf-8'),
    )
    const ModelParameters = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'ModelParameters.json', 'utf-8'),
    )
    // 通过EcoSim——Result获得种类对应的颜色
    const GroupFleetColor = {}
    const GroupColor = {}
    const FleetColor = {}
    data.EcoSim_Result_Group.forEach((el, index) => {
      if (index < EcoSimGroupPlot.EcoSim_Group_Plots.length) {
        GroupFleetColor[el.Group_name] = colorpanel[index]
        GroupColor[el.Group_name] = colorpanel[index]
      }
    })
    data.EcoSim_Result_Fleet.forEach((el, index) => {
      GroupFleetColor[el.Fleet_name] =
        colorpanel[index + data.EcoSim_Result_Group.length]
      FleetColor[el.Fleet_name] =
        colorpanel[index + data.EcoSim_Result_Group.length]
    })
    // RunEcoSim里面的图画
    let MeasuredFlag = false
    let MeasuredData = []
    // fs.access是一个异步方法。当调用这个方法时，Node.js将继续执行代码，而不会等到文件检查完成
    try {
      fs.accessSync(outfilepath + '\\' + 'Measured.json')
      console.log('Measured.json文件存在')
      MeasuredData = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'Measured.json', 'utf-8'),
      )
      MeasuredFlag = true
    } catch (err) {
      console.log('Measured.json文件不存在')
      MeasuredFlag = false
    }
    const option = SwitchEcoSim(
      RunEcoSimPlot.Biomass_relative,
      false,
      'Biomass_relative',
      ModelParameters.StartTime,
      MeasuredFlag,
      MeasuredData,
    )
    data.option = option
    const GroupPlotOption = SwitchGroupPlot(
      EcoSimGroupPlot.EcoSim_Group_Plots[0],
      GroupFleetColor,
      ModelParameters.StartTime,
    )
    const GroupPlotColor = SwitchGroupPlotColor(
      EcoSimGroupPlot.EcoSim_Group_Plots[0],
      GroupFleetColor,
    )
    data.GroupPlot = {
      Option: GroupPlotOption,
      Color: GroupPlotColor,
      GroupColor,
    }
    const FleetPlotOption = SwitchFleetPlot(
      EcoSimFleetPlot.EcoSim_Fleet_Plots[0],
      GroupFleetColor,
      ModelParameters.StartTime,
    )
    const FleetPlotColor = SwitchFleetPlotColor(
      EcoSimFleetPlot.EcoSim_Fleet_Plots[0],
      GroupFleetColor,
    )
    data.FleetPlot = {
      Option: FleetPlotOption,
      Color: FleetPlotColor,
      FleetColor,
    }
    return data
  } catch (error) {
    // 处理异常情况
  }
}

// Run EcoSim Plot Biomass_relative Biomass_absolute Catch_relative Catch_absolute切换
const RunEcoSim_Switch = async (req, res) => {
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  // console.log(projectInfo)
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  console.log(outfilepath)
  console.log('运行RunEcoSim_Switch')
  const RunEcoSimPlot = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'RunEcosim_Plot.json', 'utf-8'),
  )
  const ModelParameters = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'ModelParameters.json', 'utf-8'),
  )
  // 实测数据是否加载
  let MeasuredFlag = false
  let MeasuredData = []
  // fs.access是一个异步方法。当调用这个方法时，Node.js将继续执行代码，而不会等到文件检查完成
  try {
    fs.accessSync(outfilepath + '\\' + 'Measured.json')
    console.log('Measured.json文件存在')
    MeasuredData = JSON.parse(
      fs.readFileSync(outfilepath + '\\' + 'Measured.json', 'utf-8'),
    )
    MeasuredFlag = true
  } catch (err) {
    console.log('Measured.json文件不存在')
    MeasuredFlag = false
  }
  if (req.body.id === 'Biomass_relative') {
    const option = SwitchEcoSim(
      RunEcoSimPlot.Biomass_relative,
      false,
      'Biomass_relative',
      ModelParameters.StartTime,
      MeasuredData,
    )
    return { status: 'success', option }
  } else if (req.body.id === 'Biomass_relativ_validate') {
    if (MeasuredFlag === false) {
      return { status: 'success', option: {} }
    }
    const option = SwitchEcoSim(
      RunEcoSimPlot.Biomass_relative,
      false,
      'Biomass_relative_validate',
      ModelParameters.StartTime,
      MeasuredFlag,
      MeasuredData,
    )
    return { status: 'success', option }
  } else if (req.body.id === 'Biomass_absolute') {
    const option = SwitchEcoSim(
      RunEcoSimPlot.Biomass_absolute,
      true,
      'Biomass_absolute',
      ModelParameters.StartTime,
    )
    return { status: 'success', option }
  } else if (req.body.id === 'Catch_relative') {
    const option = SwitchEcoSim(
      RunEcoSimPlot.Catch_relative,
      false,
      'Catch_relative',
      ModelParameters.StartTime,
    )
    return { status: 'success', option }
  } else if (req.body.id === 'Catch_absolute') {
    const option = SwitchEcoSim(
      RunEcoSimPlot.Catch_absolute,
      true,
      'Catch_absolute',
      ModelParameters.StartTime,
    )
    return { status: 'success', option }
  }
}

const GroupPlot_Switch = async (req, res) => {
  console.log('GroupPlot_Switch')
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  // console.log(projectInfo)
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  console.log(outfilepath)
  const data = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'EcoSim_Result.json', 'utf-8'),
  )
  const EcoSimGroupPlot = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'EcoSim_Group_Plots.json', 'utf-8'),
  )
  const ModelParameters = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'ModelParameters.json', 'utf-8'),
  )
  // 通过EcoSim——Result获得种类对应的颜色
  const GroupFleetColor = {}
  const GroupColor = {}
  const FleetColor = {}
  data.EcoSim_Result_Group.forEach((el, index) => {
    if (index < EcoSimGroupPlot.EcoSim_Group_Plots.length) {
      GroupFleetColor[el.Group_name] = colorpanel[index]
      GroupColor[el.Group_name] = colorpanel[index]
    }
  })
  data.EcoSim_Result_Fleet.forEach((el, index) => {
    GroupFleetColor[el.Fleet_name] =
      colorpanel[index + data.EcoSim_Result_Group.length]
    FleetColor[el.Fleet_name] =
      colorpanel[index + data.EcoSim_Result_Group.length]
  })

  let selectID
  EcoSimGroupPlot.EcoSim_Group_Plots.forEach((el, index) => {
    if (el.GroupName === req.body.id) {
      selectID = index
    }
  })
  const GroupPlotOption = SwitchGroupPlot(
    EcoSimGroupPlot.EcoSim_Group_Plots[selectID],
    GroupFleetColor,
    ModelParameters.StartTime,
  )

  const GroupPlotColor = SwitchGroupPlotColor(
    EcoSimGroupPlot.EcoSim_Group_Plots[selectID],
    GroupFleetColor,
  )
  const result = {
    status: 'success',
    Option: GroupPlotOption,
    Color: GroupPlotColor,
    GroupColor,
  }
  return result
}

const FleetPlot_Switch = async (req, res) => {
  console.log('FleetPlot_Switch')
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  // console.log(projectInfo)
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  console.log(outfilepath)
  const data = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'EcoSim_Result.json', 'utf-8'),
  )
  const EcoSimGroupPlot = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'EcoSim_Group_Plots.json', 'utf-8'),
  )
  const EcoSimFleetPlot = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'EcoSim_Fleet_Plots.json', 'utf-8'),
  )
  const ModelParameters = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'ModelParameters.json', 'utf-8'),
  )
  // 通过EcoSim——Result获得种类对应的颜色
  const GroupFleetColor = {}
  const GroupColor = {}
  const FleetColor = {}
  data.EcoSim_Result_Group.forEach((el, index) => {
    if (index < EcoSimGroupPlot.EcoSim_Group_Plots.length) {
      GroupFleetColor[el.Group_name] = colorpanel[index]
      GroupColor[el.Group_name] = colorpanel[index]
    }
  })
  data.EcoSim_Result_Fleet.forEach((el, index) => {
    GroupFleetColor[el.Fleet_name] =
      colorpanel[index + data.EcoSim_Result_Group.length]
    FleetColor[el.Fleet_name] =
      colorpanel[index + data.EcoSim_Result_Group.length]
  })

  let selectID
  EcoSimFleetPlot.EcoSim_Fleet_Plots.forEach((el, index) => {
    if (el.FleetName === req.body.id) {
      selectID = index
    }
  })
  const FleetPlotOption = SwitchFleetPlot(
    EcoSimFleetPlot.EcoSim_Fleet_Plots[selectID],
    GroupFleetColor,
    ModelParameters.StartTime,
  )

  const FleetPlotColor = SwitchFleetPlotColor(
    EcoSimFleetPlot.EcoSim_Fleet_Plots[selectID],
    GroupFleetColor,
  )
  const result = {
    status: 'success',
    Option: FleetPlotOption,
    Color: FleetPlotColor,
    GroupColor,
  }
  return result
}

// RunEcoSpace
const RunEcoSpace = async (req, res) => {
  console.log('运行EcoSpace')
  try {
    const output = execSync(
      `cd "${exeFilePath}"&& ConsoleApp2.exe "${filepath}" "EcoSpace" "${outfilepath}"`,
    )
    // 处理执行命令后的结果
    const outputString = output.toString().trim()
    // console.log(outputString)
    if (outputString === 'NoneEcoSpace') {
      return outputString
    } else {
      const data = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'EcoSpace_Result.json', 'utf-8'),
      )
      const DataPlot = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'RunEcoSpace_Plot.json', 'utf-8'),
      )
      // 从Import里面拿数据名称
      const Import = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'Import_Data.json', 'utf-8'),
      )
      const ModelParameters = JSON.parse(
        fs.readFileSync(outfilepath + '\\' + 'ModelParameters.json', 'utf-8'),
      )
      const SelectOption = []
      Import.Basic_Input.forEach((el, index) => {
        SelectOption.push({ label: el.GroupName, value: index + 1 })
      })

      const Option = SwitchEcoSpace(
        DataPlot.Relative_Biomass,
        data.EcoSpace_Result_Group,
        'Relative_Biomass',
        ModelParameters.StartTime,
      )

      const RunEcoSpace_Map = JSON.parse(
        fs.readFileSync(
          outfilepath + '\\' + 'RunEcoSpace_MapColor.json',
          'utf-8',
        ),
      )

      return {
        ResultData: data,
        option: Option,
        SelectOption,
        FirstResultMap: {
          id: SelectOption[0].value,
          data: RunEcoSpace_Map['1'][0],
        },
        Time: ModelParameters.EcoSpaceTime,
      }
    }
  } catch (error) {
    // 处理异常情况
  }
}

const RunEcoSpace_Switch = async (req, res) => {
  console.log('RunEcoSpace_Switch')
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  // console.log(projectInfo)
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  // console.log(outfilepath)
  // 辅助变量 data 取Group里面的名字Name
  const data = JSON.parse(
    fs.readFileSync(outfilepath + '\\' +'EcoSpace_Result_'+ Modeltype[req.body.modeltype] +'.json', 'utf-8'),
  )
  const RunEcoSpacePlot = JSON.parse(
    fs.readFileSync(outfilepath + '\\' +'RunEcoSpace_Plot_'+ Modeltype[req.body.modeltype] +'.json', 'utf-8'),
  )
  const ModelParameters = JSON.parse(
    fs.readFileSync(outfilepath + '\\' + 'ModelParameters.json', 'utf-8'),
  )
  if (req.body.id === 'Relative_Biomass') {
    const option = SwitchEcoSpace(
      RunEcoSpacePlot.Relative_Biomass,
      data.EcoSpace_Result_Group,
      'Relative_Biomass',
      ModelParameters.StartTime,
    )
    option["type"] = req.body.modeltype 
    option["status"] = 'success'
    return option
  } else if (req.body.id === 'Relative_Fishing_Mortality') {
    const option = SwitchEcoSpace(
      RunEcoSpacePlot.FishingMort,
      data.EcoSpace_Result_Group,
      'FishingMort',
      ModelParameters.StartTime,
    )
    option["type"] = req.body.modeltype 
    option["status"] = 'success'
    return option
  } else if (req.body.id === 'Relative_predation_mortasality') {
    const option = SwitchEcoSpace(
      RunEcoSpacePlot.PredMortRate,
      data.EcoSpace_Result_Group,
      'PredMortRate',
      ModelParameters.StartTime,
    )
    option["type"] = req.body.modeltype 
    option["status"] = 'success'
    return option
  } else if (req.body.id === 'Relative_Consumption') {
    const option = SwitchEcoSpace(
      RunEcoSpacePlot.ConsumptRate,
      data.EcoSpace_Result_Group,
      'ConsumptRate',
      ModelParameters.StartTime,
    )
    option["type"] = req.body.modeltype 
    option["status"] = 'success'
    return option
  } else if (req.body.id === 'Relative_Catch') {
    const option = SwitchEcoSpace(
      RunEcoSpacePlot.Relative_Catch,
      data.EcoSpace_Result_Group,
      'Relative_Catch',
      ModelParameters.StartTime,
    )
    option["type"] = req.body.modeltype 
    option["status"] = 'success'
    return option
  }
}

const RunEcoSpace_SwitchMap = async (req, res) => {
  console.log('RunEcoSpace_SwitchMap')
  const projectInfo = await orm.project.getProjectByProjectID(
    req.body.projectID,
  )
  // console.log(projectInfo)
  const ewefilepath =
    DATA_FOLDER_PATH + projectInfo.project_folder_path + '/ewe/' + req.body.name
  const outfilepath =
    DATA_FOLDER_PATH +
    projectInfo.project_folder_path +
    '/ewe/' +
    req.body.name.split('.')[0]
  console.log(outfilepath)
  let RunEcoSpace_Map = JSON.parse(fs.readFileSync(outfilepath+"\\"+'RunEcoSpace_MapColor_'+ Modeltype[req.body.modeltype] +'.json', 'utf-8'))
  let RunEcoSpace_Stanze = JSON.parse(fs.readFileSync(outfilepath+"\\"+'RunEcoSpace_StanzaDS_'+ Modeltype[req.body.modeltype] +'.json', 'utf-8'))

  return {
    status:"success",
    id:req.body.id,
    data:RunEcoSpace_Map[req.body.id][req.body.time],
    time:req.body.time,
    type:req.body.modeltype,
    stanze:RunEcoSpace_Stanze[req.body.id][req.body.time]
  }
}

export const eweService = {
  test_get,
  UploadTimeseries,
  UploadForcing,
  UploadMeasured,
  Import_Model,
  Load_Model,
  Run_Model,
  RunEcoPath,
  RunEcoSim,
  RunEcoSim_Switch,
  GroupPlot_Switch,
  FleetPlot_Switch,
  RunEcoSpace,
  RunEcoSpace_Switch,
  RunEcoSpace_SwitchMap,
}
