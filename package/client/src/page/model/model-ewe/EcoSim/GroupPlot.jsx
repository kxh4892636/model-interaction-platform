import React, { useEffect } from 'react'
import * as echarts from 'echarts'
import {
  EcoSimGroup_Plot,
  EcoSimGroup_PlotColor,
  EcoSimGroup_PlotColorFleet,
  EcoSimGroup_PlotColorPred,
  EcoSimGroup_PlotColorPrey,
} from '../../../../store/eweStore'

export default function GroupPlot() {
  const PlotOption = EcoSimGroup_Plot((state) => state.Data)
  const Group_PlotColor = EcoSimGroup_PlotColor((state) => state.Data)
  const Group_PlotPred = EcoSimGroup_PlotColorPred((state) => state.Data)
  const Group_PlotPrey = EcoSimGroup_PlotColorPrey((state) => state.Data)
  const Group_PlotFleet = EcoSimGroup_PlotColorFleet((state) => state.Data)
  useEffect(() => {
    let myChart = echarts.getInstanceByDom(
      document.getElementById('EcoSimGroupPlot'),
    ) //有的话就获取已有echarts实例的DOM节点。
    // console.log(myChart)
    if (myChart == null) {
      // 如果不存在，就进行初始化。
      myChart = echarts.init(document.getElementById('EcoSimGroupPlot'))
    }
    myChart.clear()
    var option = PlotOption
    // console.log(PlotOption)
    option && myChart.setOption(option)
  }, [PlotOption.id]) //eslint-disable-line
  return (
    <div style={{ display: 'flex', height: '88%' }}>
      <div id="EcoSimGroupPlot" style={{ height: '100%', width: '80%' }}></div>
      <div style={{ height: '100%', width: '20%' }}>
        <div style={{ height: '45%' }}>
          <div
            style={{ height: '20px', background: '#778899', color: 'white' }}
          >
            Group
          </div>
          <div
            style={{
              height: '94%',
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
        <div style={{ height: '20%' }}>
          <div
            style={{ height: '20px', background: '#778899', color: 'white' }}
          >
            Predatorsranked
          </div>
          <div
            style={{
              height: '86%',
              overflow: 'auto',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderBlockEnd: 'none',
            }}
          >
            <ul style={{ paddingLeft: 10, marginTop: 2 }}>{Group_PlotPred}</ul>
          </div>
        </div>
        <div style={{ height: '20%' }}>
          <div
            style={{ height: '20px', background: '#778899', color: 'white' }}
          >
            Preyranked
          </div>
          <div
            style={{
              height: '86%',
              overflow: 'auto',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderBlockEnd: 'none',
            }}
          >
            <ul style={{ paddingLeft: 10, marginTop: 2 }}>{Group_PlotPrey}</ul>
          </div>
        </div>
        <div style={{ height: '15%' }}>
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
            }}
          >
            <ul style={{ paddingLeft: 10, marginTop: 2 }}>{Group_PlotFleet}</ul>
          </div>
        </div>
      </div>
    </div>
  )
}
