import React, { useEffect } from 'react'
import { FlowDiagram } from '../store';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphChart,
  CanvasRenderer
]);

const colorpanel = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',
                    "#17b978", "#00adb5", "#393e46", "#6a2c70", "#b83b5e", "#f08a5d", "#f9ed69", "#95e1d3", "#eaffd0",
                    "#ff2e63", "#08d9d6", "#aa96da", "#ffde7d", "#f8f3d4", "#53354a", "#903749", "#e84545", "#2b2e4a",
                    "#0dceda", "#6ef3d6", "#c6fce5", "#d72323", "#005691", "#dbedf3", "#f73859", "#ffc93c", "#ff9a3c",
                    "#ff6f3c", "#f5c7f7", "#5e63b6", "#fdc7ff", "#7a08fa", "#2eb872", "#f12b6b", "#e43a19", "#015051"]
export default function App() {
const graph = FlowDiagram((state) => state.Graph)
useEffect(()=>{
  console.log(graph,graph.length)
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option
  if(Object.keys(graph).length===0){
    option = {
      title: {
        text: "Calculation results required",
        subtext: "Flow Diagram",
        left: "center",
        top: "center",
        textStyle: {
          fontSize: 30
        },
        subtextStyle: {
          fontSize: 20
        }
      }
    }
  }
  else{
    option = {
    // 强行对legend颜色设置
    color:colorpanel,
    // title: {
    //   text: 'Les Miserables',
    //   subtext: 'Default layout',
    //   top: 'bottom',
    //   left: 'right'
    // },
    tooltip: {},
    legend: [
      {
        // selectedMode: 'single',
        data: graph.categories.map(function (a) {
          return a.name;
        }),
      }
    ],
    // coordinateSystem:"cartesian2d",
    xAxisIndex:0,
    yAxisIndex:0,
    grid:{},
    // xAxis: [
    //   {
    //     type: 'category',
    //     scale: true,
    //     axisLabel: {
    //       formatter: '{value} cm'
    //     },
    //     splitLine: {
    //       show: false
    //     }
    //   }
    // ],
    // yAxis: [
    //   {
    //     type: 'value',
    //     show:true,
    //     // scale: true,
    //     data:[1,2,3,4],
    //     axisLabel: {
    //       formatter: '{value} kg'
    //     },
    //     // splitLine: {
    //     //   show: false
    //     // }
    //   }
    // ],
    // xAxis :[{
    //   show:true,
    //   type: "category",
    //   data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun","asd","qwe","qweqew","zxc","qweqw","try","hjk"]
    // }],
    // yAxis: [{
    //   type: "value",
    // }],

    // 合完代码之后，这的设置失效了，大于小速度都很快 
    animationDuration: 1000,
    animationEasingUpdate: 'linear',
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'none',
        data: graph.node,
        links: graph.link,
        categories: graph.categories,
        // coordinateSystem:"cartesian2d",
        // itemStyle:{
        //   color: function(params) {
        //     // build a color map as your need.
        //     var colorList = colorpanel;
        //     // console.log(params.seriesIndex, params.dataIndex, params.data, params.value)
        //     return colorList[params.dataIndex] 
        // }},
        tooltip:{
          formatter(params){
            // 线和点的tooltip分开来渲染
            if(typeof(params.data.Biomass) === "undefined"){
              return `<b>${params.data.targetname}</b>--><b>${params.data.sourcename}</b></br></br><b>Flow: </b>${params.data.dietcatchvalue}`
            }
            else{
              return `<b>Name: </b>${params.data.name}</br><b>Biomass: </b>${params.data.Biomass}</br><b>Trophic Level: </b>${params.data.TL}`
            }

          }
        },
        roam: true,
        label: {
          show:true,
          position: 'right',
          formatter: '{b}'
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10
          }
        },
      }
    ]
    };
  }
  myChart.setOption(option);
})

  return (
    // <img width={800} height={800} src={image}/>
    <div id='main' style={{height:"100%"}}>
    </div>

  )
}



