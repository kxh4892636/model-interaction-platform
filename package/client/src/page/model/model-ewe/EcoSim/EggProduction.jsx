import React, { useEffect } from 'react'
import * as echarts from 'echarts'
import { EggProductionData } from '../../../../store/eweStore'
export default function EggProduction() {
  useEffect(() => {
    let myChart = echarts.getInstanceByDom(
      document.getElementById('EggProduction'),
    ) //有的话就获取已有echarts实例的DOM节点。
    if (myChart == null) {
      // 如果不存在，就进行初始化。
      myChart = echarts.init(document.getElementById('EggProduction'))
    }
    myChart.clear()
    var option

    option = {
      title: {
        text: '产卵函数',
        top: 'top',
        left: 'center',
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          itemStyle: {
            color: 'rgba(255, 217, 0, 0.99)',
            borderColor: 'rgba(255, 217, 0, 1)',
          },
          data: EggData,
          type: 'bar',
          barCategoryGap: '0%',
        },
      ],
    }
    option && myChart.setOption(option)
  })
  const EggData = EggProductionData((state) => state.Data)
  return <div style={{ height: '80%' }} id="EggProduction"></div>
}
