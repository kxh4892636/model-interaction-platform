import React, { useEffect } from 'react'
import { FlowDiagram } from '../../../../store/eweStore'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphChart,
  CanvasRenderer,
])

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
  '#ff2e63',
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
export default function App() {
  const graph = FlowDiagram((state) => state.Data)
  useEffect(() => {
    let myChart = echarts.getInstanceByDom(document.getElementById('main')) //有的话就获取已有echarts实例的DOM节点。
    if (myChart == null) {
      // 如果不存在，就进行初始化。
      myChart = echarts.init(document.getElementById('main'))
    }
    myChart.clear()
    var option
    if (Object.keys(graph).length === 0) {
      option = {
        title: {
          text: 'Calculation results required',
          subtext: 'Flow Diagram',
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 30,
          },
          subtextStyle: {
            fontSize: 20,
          },
        },
      }
    } else {
      option = {
        // 强行对legend颜色设置
        color: colorpanel,
        title: {
          text: '食物网结构图',
          top: 'top',
          left: 'center',
        },
        tooltip: {},
        legend: [
          {
            data: graph.categories.map(function (a) {
              return a.name
            }),
            show: true,
            type: 'scroll',
            orient: 'horizontal',
            icon: 'rect',
            width: '80%',
            top: '8%',
          },
        ],
        xAxisIndex: 0,
        yAxisIndex: 0,
        grid: {},
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: 'Les Miserables',
            type: 'graph',
            layout: 'none',
            data: graph.node,
            links: graph.link,
            categories: graph.categories,
            tooltip: {
              formatter(params) {
                // 线和点的tooltip分开来渲染
                if (typeof params.data.Biomass === 'undefined') {
                  return `<b>${params.data.targetname}</b>--><b>${params.data.sourcename}</b></br></br><b>Flow: </b>${params.data.dietcatchvalue}`
                } else {
                  return `<b>Name: </b>${params.data.name}</br><b>Biomass: </b>${params.data.Biomass}</br><b>Trophic Level: </b>${params.data.TL}`
                }
              },
            },
            roam: true,
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10,
              },
            },
          },
        ],
      }
    }
    myChart.setOption(option)
  })

  return (
    <div style={{ height: '100%' }}>
      <div id="main" style={{ height: '100%' }}></div>
    </div>
  )
}
