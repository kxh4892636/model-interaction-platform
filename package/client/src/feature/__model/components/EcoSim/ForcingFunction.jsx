import React,{ useEffect }from 'react'
import * as echarts from "echarts"
import { ForcingFunctionData } from '../../store';
export default function ForcingFunction() {
  useEffect(()=>{
    let myChart= echarts.getInstanceByDom(document.getElementById('ForcingFunction')); //有的话就获取已有echarts实例的DOM节点。
    if (myChart== null) { // 如果不存在，就进行初始化。
      myChart= echarts.init(document.getElementById('ForcingFunction'));
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
            color: "rgba(255, 0, 0, 0.99)",
            borderColor: "rgba(255, 0, 0, 1)"
          },
          data: ForcingData,
          type: 'bar',
          barCategoryGap: "0%"
        }
      ]
    };
    // console.log(option)
    option && myChart.setOption(option);
  })
  const ForcingData = ForcingFunctionData((state) => state.Data)
  return (
    <div style={{height:"50%"}} id="ForcingFunction"></div>
  )
}
