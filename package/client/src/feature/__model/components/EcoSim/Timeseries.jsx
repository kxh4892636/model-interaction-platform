import React, { useEffect } from 'react'
import { Select,Space } from 'antd'
import * as echarts from "echarts"
import { TimeSelect,TimeSeriesData,TimeSeriesPlot,TimeYearData,TimeSelected } from '../../store'
export default function Timeseries() {
  useEffect(()=>{
    let myChart= echarts.getInstanceByDom(document.getElementById('TimeSeries')); //有的话就获取已有echarts实例的DOM节点。
    if (myChart== null) { // 如果不存在，就进行初始化。
      myChart= echarts.init(document.getElementById('TimeSeries'));
    }
    myChart.clear()
    var option;

    option = {
      xAxis: {
        type: 'category',
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        data:TimeYearDatatD
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: TimeSeriesPlotD,
          type: 'line',
          smooth: true
        }
      ]
    };
    // console.log(option)
    option && myChart.setOption(option);
  })
  const SelectOption = TimeSelect((state) => state.Data)
  const TimeSeriesD = TimeSeriesData((state) => state.Data)
  const TimeSeriesPlotD = TimeSeriesPlot((state) => state.Data)
  const TimeYearDatatD = TimeYearData((state) => state.Data)
  const TimeSelectedD = TimeSelected((state) => state.Data)
  const setTimeSelectedD = TimeSelected((state) => state.setData)
  const setTimeSeriesPlotD = TimeSeriesPlot((state) => state.setData)
  return (
    <div style={{height:"80%",width:"100%"}}>
        <Space>
        <span>变量选择</span>
        <Select
            value={TimeSelectedD}
            style={{
            width: 240,
            }}
            onChange={(value) => {
              setTimeSeriesPlotD(TimeSeriesD[value].slice(2))
              setTimeSelectedD(value)
            }}
            options={SelectOption}
        />
        </Space>
        <div id="TimeSeries" style={{height:"50%"}}></div>
    </div>
  )
}
