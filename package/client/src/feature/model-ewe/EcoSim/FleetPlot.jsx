import React, { useEffect } from 'react'
import * as echarts from 'echarts'
import {
  EcoSimFleet_Plot,
  EcoSimFleet_PlotColor,
  EcoSimFleet_PlotColorGroup,
} from '../../../store/eweStore'

export default function FleetPlot() {
  const PlotOption = EcoSimFleet_Plot((state) => state.Data)
  const Group_PlotColor = EcoSimFleet_PlotColor((state) => state.Data)
  const Group_PlotFleet = EcoSimFleet_PlotColorGroup((state) => state.Data)
  useEffect(() => {
    let myChart = echarts.getInstanceByDom(
      document.getElementById('EcoSimFleetPlot'),
    ) //有的话就获取已有echarts实例的DOM节点。
    // console.log(myChart)
    if (myChart == null) {
      // 如果不存在，就进行初始化。
      myChart = echarts.init(document.getElementById('EcoSimFleetPlot'))
    }
    myChart.clear()
    var option = PlotOption
    // console.log(PlotOption)
    option && myChart.setOption(option)
  }, [PlotOption.id]) //eslint-disable-line
  return (
    <div style={{ display: 'flex', height: '88%' }}>
      <div id="EcoSimFleetPlot" style={{ height: '100%', width: '80%' }}></div>
      <div style={{ height: '100%', width: '20%' }}>
        <div style={{ height: '50%' }}>
          <div
            style={{ height: '20px', background: '#778899', color: 'white' }}
          >
            Fleets
          </div>
          <div
            style={{
              height: '95%',
              overflow: 'auto',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderBlockEnd: 'none',
            }}
          >
            <ul style={{ paddingLeft: 10, marginTop: 2, cursor: 'pointer' }}>
              {Group_PlotColor}
            </ul>
          </div>
        </div>
        <div style={{ height: '50%' }}>
          <div
            style={{ height: '20px', background: '#778899', color: 'white' }}
          >
            Groups
          </div>
          <div
            style={{
              height: '95%',
              overflow: 'auto',
              borderStyle: 'solid',
              borderWidth: '1px',
            }}
          >
            <ul style={{ paddingLeft: 10, marginTop: 2 }}>{Group_PlotFleet}</ul>
          </div>
        </div>
      </div>
    </div>
  )
}
