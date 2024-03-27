import React, { useEffect }from 'react'
import * as echarts from 'echarts'

export default function GroupPlotTest() {
    useEffect(()=>{
        let myChart= echarts.getInstanceByDom(document.getElementById('EcoSimGroupPlot')); //有的话就获取已有echarts实例的DOM节点。
        console.log(myChart)
        if (myChart== null) { // 如果不存在，就进行初始化。
          myChart= echarts.init(document.getElementById('EcoSimGroupPlot'));

        }
        myChart.clear()
        var option;
        
        const dataAll = [
          [
            [10.0, 8.04],
            [8.0, 6.95],
            [13.0, 7.58],
            [9.0, 8.81],
            [11.0, 8.33],
            [14.0, 9.96],
            [6.0, 7.24],
            [4.0, 4.26],
            [12.0, 10.84],
            [7.0, 4.82],
            [5.0, 5.68]
          ],
          [
            [10.0, 9.14],
            [8.0, 8.14],
            [13.0, 8.74],
            [9.0, 8.77],
            [11.0, 9.26],
            [14.0, 8.1],
            [6.0, 6.13],
            [4.0, 3.1],
            [12.0, 9.13],
            [7.0, 7.26],
            [5.0, 4.74]
          ],
          [
            [10.0, 7.46],
            [8.0, 6.77],
            [13.0, 12.74],
            [9.0, 7.11],
            [11.0, 7.81],
            [14.0, 8.84],
            [6.0, 6.08],
            [4.0, 5.39],
            [12.0, 8.15],
            [7.0, 6.42],
            [5.0, 5.73]
          ],
          [
            [8.0, 6.58],
            [8.0, 5.76],
            [8.0, 7.71],
            [8.0, 8.84],
            [8.0, 8.47],
            [8.0, 7.04],
            [8.0, 5.25],
            [19.0, 12.5],
            [8.0, 5.56],
            [8.0, 7.91],
            [8.0, 6.89]
          ]
        ];
        const markLineOpt = {
          animation: false,
          label: {
            formatter: 'y = 0.5 * x + 3',
            align: 'right'
          },
          lineStyle: {
            type: 'solid'
          },
          tooltip: {
            formatter: 'y = 0.5 * x + 3'
          },
          data: [
            [
              {
                coord: [0, 3],
                symbol: 'none'
              },
              {
                coord: [20, 13],
                symbol: 'none'
              }
            ]
          ]
        };
        option = {
          title: {
            text: "Anscombe's quartet",
            left: 'center',
            top: 0
          },
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
          tooltip: {
            formatter: 'Group {a}: ({c})'
          },
          xAxis: [
            { gridIndex: 0, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48,
            },              splitLine: {
              show: false
            }},
            { gridIndex: 1, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 2, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 3, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 4, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 5, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 6, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 7, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 8, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 9, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 10, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
            { gridIndex: 11, min: 0, max: 20,name: "Biomass",nameLocation: "middle",
            nameTextStyle: {
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: 16,
              lineHeight: 48
            }},
          ],
          yAxis: [
            { gridIndex: 0,    splitLine: {
              show: false
            }},
            { gridIndex: 1},
            { gridIndex: 2},
            { gridIndex: 3},
            { gridIndex: 4},
            { gridIndex: 5},
            { gridIndex: 6},
            { gridIndex: 7},
            { gridIndex: 8},
            { gridIndex: 9},
            { gridIndex: 10},
            { gridIndex: 11},
          ],
          series: [
            {
              name: 'I',
              type: 'scatter',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: dataAll[0],
              markLine: markLineOpt
            },
            {
              name: 'II',
              type: 'scatter',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: dataAll[1],
              markLine: markLineOpt
            },
            {
              name: 'III',
              type: 'scatter',
              xAxisIndex: 2,
              yAxisIndex: 2,
              data: dataAll[2],
              markLine: markLineOpt
            },
            {
              name: 'IV',
              type: 'scatter',
              xAxisIndex: 3,
              yAxisIndex: 3,
              data: dataAll[3],
              markLine: markLineOpt
            },
            {
              'stack': 'Total',
              'areaStyle': {},
              name: 'IV',
              type: 'line',
              xAxisIndex: 4,
              yAxisIndex: 4,
              data:           [
                [10.0, 0],
                [8.0, 0],
                [13.0, 0],
                [9.0, 0],
                [11.0, 0],
                [14.0, 0],
                [6.0, 0],
                [4.0, 0],
                [12.0, 0],
                [7.0, 0],
                [5.0, 0]
              ],
            },
            {
              name: 'IV',
              type: 'scatter',
              xAxisIndex: 5,
              yAxisIndex: 5,
              data: dataAll[3],
              markLine: markLineOpt
            },
            {
              name: 'IV',
              type: 'scatter',
              xAxisIndex: 6,
              yAxisIndex: 6,
              data: dataAll[3],
              markLine: markLineOpt
            },
            {
              name: 'IV',
              type: 'scatter',
              xAxisIndex: 7,
              yAxisIndex: 7,
              data: dataAll[3],
              markLine: markLineOpt
            },
            {
              name: 'IV',
              type: 'scatter',
              xAxisIndex: 8,
              yAxisIndex: 8,
              data: dataAll[3],
              markLine: markLineOpt
            },
            {
              name: 'IV',
              type: 'scatter',
              xAxisIndex: 9,
              yAxisIndex: 9,
              data: dataAll[3],
              markLine: markLineOpt
            },
            {
              name: 'IV',
              type: 'scatter',
              xAxisIndex: 10,
              yAxisIndex: 10,
              data: dataAll[3],
              markLine: markLineOpt
            },
            {
              name: 'IV',
              type: 'scatter',
              xAxisIndex: 11,
              yAxisIndex: 11,
              data: dataAll[3],
              markLine: markLineOpt
            }
          ]
        };
        option && myChart.setOption(option);
          
    })//eslint-disable-line
  return (
    <div style={{display:"flex",height:"88%"}}>
        <div id='EcoSimGroupPlot' style={{height:"100%",width:"80%"}}></div>
        <div style={{height:"100%",width:"20%"}}>
          <div style={{height:"45%",overflow:'auto',borderStyle:"solid",borderWidth:"1px",borderBlockEnd:"none"}}>
            <div style={{background:"#778899",color:"white"}}>Group</div>
            <ul style={{paddingLeft:10,marginTop:2,cursor:"pointer"}}>
            <li style={{listStyleType:"none",cursor:"pointer"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle",border:"solid",borderWidth:"1px"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}><span style={{width:"20px",height:"10px",background:"yellow",display:"inline-block",verticalAlign:"middle"}}></span>  java</li>
            <li style={{listStyleType:"none"}}>《java》</li>
            <li style={{listStyleType:"none"}}>《java》</li>
            <li style={{listStyleType:"none"}}>《java》</li>
            <li style={{listStyleType:"none"}}>《java》</li>
            </ul>
          </div>
          <div style={{height:"20%",overflow:'auto',borderStyle:"solid",borderWidth:"1px",borderBlockEnd:"none"}}>
            <div style={{background:"#778899",color:"white"}}>Predatorsranked</div>
          </div>
          <div style={{height:"20%",overflow:'auto',borderStyle:"solid",borderWidth:"1px",borderBlockEnd:"none"}}>
            <div style={{background:"#778899",color:"white"}}>Preyranked</div>
          </div>
          <div style={{height:"15%",overflow:'auto',borderStyle:"solid",borderWidth:"1px"}}>
            <div style={{background:"#778899",color:"white"}}>Fleets</div>
          </div>
        </div>
    </div>
  )
}

