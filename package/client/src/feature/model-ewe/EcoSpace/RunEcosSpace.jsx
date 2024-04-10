import React, { useEffect, useState } from 'react'
import { Tabs, Space, Select, Progress, Button } from 'antd'
import { PlayCircleFilled } from '@ant-design/icons'
import * as echarts from 'echarts'
import {
  RunEcoSpace_Option,
  RunEcoSpacae_SelectOption,
  RunEcoSpacae_PlotMap,
  RunEcoSpacae_DefaultSelect,
  EcoSpaceTime,
} from '../../../store/eweStore'
import axios from 'axios'
import InputMap from './InputMap'
function getGradientColors() {
  // const colors = ["#FF0000", "#FF6602", "#FCBF02", "#ADFF25", "#64FFAC","#9DFAFF"];
  const colors = [
    '#9DFAFF',
    '#64FFAC',
    '#A4FA23',
    '#FCBF02',
    '#FF6602',
    '#FF0000',
  ]
  const numSteps = 200 / (colors.length - 1)
  let gradientColors = []

  for (let i = 0; i < colors.length - 1; i++) {
    const startColor = hexToRgb(colors[i])
    const endColor = hexToRgb(colors[i + 1])
    //直接gradientColors.push(startColor)会是这种{r: 255, g: 0, b: 0}，会使渲染成灰色"rgb(111, 111, 111)";很奇怪
    gradientColors.push(
      `rgb(${startColor.r}, ${startColor.g}, ${startColor.b})`,
    )

    for (let j = 1; j < numSteps; j++) {
      const r = Math.round(
        startColor.r + ((endColor.r - startColor.r) * j) / numSteps,
      )
      const g = Math.round(
        startColor.g + ((endColor.g - startColor.g) * j) / numSteps,
      )
      const b = Math.round(
        startColor.b + ((endColor.b - startColor.b) * j) / numSteps,
      )
      gradientColors.push(`rgb(${r}, ${g}, ${b})`)
    }
  }
  const endColor = hexToRgb(colors[colors.length - 1])
  gradientColors.push(`rgb(${endColor.r}, ${endColor.g}, ${endColor.b})`)

  return gradientColors
}
function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16)
  const g = parseInt(hex.substring(3, 5), 16)
  const b = parseInt(hex.substring(5, 7), 16)
  return { r, g, b }
}
const gradientColors = getGradientColors()
// console.log(gradientColors)
function Map(props) {
  const gridData = props.data

  useEffect(() => {
    // 绘制栅格
    function drawGrid() {
      const canvas = document.getElementById('Run_gridCanvas')
      const ctx = canvas.getContext('2d')
      //每次绘图前清楚一边画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // const cellSize = canvas.width / gridSize;
      if (gridData.id === 'none') {
        ctx.fillStyle = 'rgb(111, 111, 111)'
        const cellSize = canvas.width
        ctx.fillRect(0, 0, cellSize, cellSize)
      } else {
        const gridSize = gridData.data.length
        const cellSize = 15
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            const value = gridData.data[i][j]
            // const color = getColor(value);
            if (value === 0) {
              console.log(value, `rgb(111, 111, 111)`)
              ctx.fillStyle = `rgb(111, 111, 111)`
            } else {
              // console.log(value,gradientColors[value])
              ctx.fillStyle = gradientColors[value]
            }
            // ctx.fillStyle = color;
            ctx.fillRect(
              (550 - 15 * 35) / 2 + j * cellSize,
              (550 - 15 * 35) / 2 + i * cellSize,
              cellSize + 0.5,
              cellSize + 0.5,
            )
          }
        }
      }
    }
    // console.log("useeffect")
    drawGrid()
  }, [props.data.id, props.data.time])
  return (
    <>
      <div>
        <canvas
          id="Run_gridCanvas"
          width="550px"
          height="550px"
          style={{ border: '1px solid black' }}
        ></canvas>
      </div>
    </>
  )
}
function Maps() {
  const [progress, setprogress] = useState(0)
  const MapSelectOption = RunEcoSpacae_SelectOption((state) => state.Data)
  const MapData = RunEcoSpacae_PlotMap((state) => state.Data)
  const setMapData = RunEcoSpacae_PlotMap((state) => state.setData)
  const DefaultSelect = RunEcoSpacae_DefaultSelect((state) => state.Data)
  const setDefaultSelect = RunEcoSpacae_DefaultSelect((state) => state.setData)
  const Time = EcoSpaceTime((state) => state.Data)
  const SwitchRunEcoSpaceMap = (value, n) => {
    axios({
      method: 'post',
      baseURL: 'http://localhost:4000/formal/RunEcoSpace_SwitchMap',
      data: { id: value, num: n },
    }).then((response) => {
      console.log(response.data)
      if (response.status === 200) {
        setMapData(response.data)
        if (n === 0) {
          setprogress(0)
        }
      }
    })
  }
  function drawGrids() {
    // const colors = ["black","white","red","blue","green","yellow","grey"]
    let i = 0
    // const canvas = document.getElementById('Run_gridCanvas');
    // const ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    function test() {
      if (i < Time) {
        // console.log(i,ctx)
        // //每次绘图前清楚一边画布
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = colors[i];
        // const cellSize = canvas.width
        // ctx.fillRect(0, 0,  cellSize,cellSize);
        // 循环动画
        // requestAnimationFrame(drawGrid2);
        console.log(i)
        SwitchRunEcoSpaceMap(DefaultSelect, i)
        setprogress(i * Math.ceil(100 / Time))
        setTimeout(test, 250)
        i += 1
        // setprogress(i*10)
      }
    }
    test()
  }
  return (
    <div style={{ display: 'flex' }}>
      <InputMap></InputMap>
      <div style={{ marginLeft: '150px' }}>
        <h1 style={{ fontSize: 20, textAlign: 'center' }}>Relative Biomass</h1>
        <Space>
          <span>物种选择</span>
          <Select
            value={DefaultSelect}
            style={{
              width: 240,
            }}
            onChange={(value) => {
              SwitchRunEcoSpaceMap(value, 0)
              setDefaultSelect(value)
            }}
            options={MapSelectOption}
          />
        </Space>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <Map data={MapData}></Map>
          <div
            style={{
              width: '20px',
              height: '550px',
              marginLeft: '10px',
              background:
                'linear-gradient(to top, #9DFAFF,#64FFAC,#A4FA23,#FCBF02,#FF6602,#FF0000)',
            }}
          ></div>
        </div>

        <Button
          onClick={drawGrids}
          type="primary"
          shape="circle"
          icon={<PlayCircleFilled />}
          size={'small'}
        />
        <Progress percent={progress} style={{ width: '600px' }} />
      </div>
    </div>
  )
}
function Graph() {
  const SelectOptions = [
    { value: 'Relative_Biomass', label: 'Relative_Biomass' },
    { value: 'Relative_Catch', label: 'Relative_Catch' },
    {
      value: 'Relative_Fishing_Mortality',
      label: 'Relative_Fishing_Mortality',
    },
    {
      value: 'Relative_predation_mortasality',
      label: 'Relative_predation_mortasality',
    },
    { value: 'Relative_Consumption', label: 'Relative_Consumption' },
  ]
  const PlotOption = RunEcoSpace_Option((state) => state.Data)
  const setPlotOption = RunEcoSpace_Option((state) => state.setData)
  const SwitchRunEcoSpace = (value) => {
    axios({
      method: 'post',
      baseURL: 'http://localhost:4000/formal/RunEcoSpace_Switch',
      data: { id: value },
    }).then((response) => {
      if (response.status === 200) {
        setPlotOption(response.data)
      }
    })
  }
  useEffect(() => {
    console.log(PlotOption.id)
    let myChart = echarts.getInstanceByDom(
      document.getElementById('RunEcoSpace'),
    ) //有的话就获取已有echarts实例的DOM节点。
    if (myChart == null) {
      // 如果不存在，就进行初始化。
      myChart = echarts.init(document.getElementById('RunEcoSpace'))
    }
    myChart.clear()
    var option = PlotOption
    option && myChart.setOption(option)
  }, [PlotOption.id]) //eslint-disable-line
  return (
    <>
      <Space>
        <span>变量选择</span>
        <Select
          defaultValue={'Biomass_relative'}
          style={{
            width: 240,
          }}
          onChange={(value) => {
            SwitchRunEcoSpace(value)
          }}
          options={SelectOptions}
        />
      </Space>
      <div id="RunEcoSpace" style={{ height: '77vh', width: '84vw' }}></div>
    </>
  )
}

export default function RunEcosSpace() {
  const items = [
    {
      key: '1',
      label: 'Graph',
      children: <Graph></Graph>,
    },
    {
      key: '2',
      label: 'Map',
      children: <Maps></Maps>,
    },
  ]
  return <Tabs defaultActiveKey="1" items={items} style={{ height: '90%' }} />
}
