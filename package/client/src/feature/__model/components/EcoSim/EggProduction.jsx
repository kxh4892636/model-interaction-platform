import React,{useEffect} from 'react'
import * as echarts from "echarts"
import { EggProductionData } from '../../store';
export default function EggProduction() {
  useEffect(()=>{
    let myChart= echarts.getInstanceByDom(document.getElementById('EggProduction')); //有的话就获取已有echarts实例的DOM节点。
    if (myChart== null) { // 如果不存在，就进行初始化。
      myChart= echarts.init(document.getElementById('EggProduction'));
    }
    myChart.clear()
    var option;

    option = {
      xAxis: {
        type: 'category',
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        // data:TimeYearDatatD
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          itemStyle: {
            color: "rgba(255, 217, 0, 0.99)",
            borderColor: "rgba(255, 217, 0, 1)"
          },
          data: EggData,
          type: 'bar',
          barCategoryGap: "0%"
        }
      ]
    };
    // console.log(option)
    option && myChart.setOption(option);
  })
  const EggData = EggProductionData((state) => state.Data)
  return (
    <div style={{height:"50%"}} id="EggProduction"></div>
  )
}
