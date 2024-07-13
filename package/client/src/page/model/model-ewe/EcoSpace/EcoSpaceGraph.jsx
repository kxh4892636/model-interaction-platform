import React, { useEffect, useState } from 'react'
import { Tabs, Space, Select, Progress, Button } from 'antd'
import { PlayCircleFilled } from '@ant-design/icons'
import * as echarts from 'echarts'
import {
  RunEcoSpacae_ModelType,
  RunEcoSpace_Option,
  RunEcoSpacae_SelectOption,
  RunEcoSpacae_PlotMap,
  RunEcoSpacae_DefaultSelect,
  EcoSpaceTime,
} from '../../../../store/eweStore'
import { postEcoSpaceGraphSwitchAPI } from '@/api/model/model.api'
import { useMetaStore } from '@/store/metaStore'
import { eweFile } from '@/store/eweStore'
export default function EcoSpaceGraph() {
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
  const projectID = useMetaStore((state) => state.projectID)
  const ewefile = eweFile((state) => state.Data)
  const [Selected, setSelected] = useState('Relative_Biomass')
  const ModelType = RunEcoSpacae_ModelType((state) => state.Data)
  const setModelType = RunEcoSpacae_ModelType((state) => state.setData)
  const PlotOption = RunEcoSpace_Option((state) => state.Data)
  const setPlotOption = RunEcoSpace_Option((state) => state.setData)
  const SwitchRunEcoSpace = async (value, m) => {
    const result = await postEcoSpaceGraphSwitchAPI({
      projectID: projectID,
      name: ewefile,
      id: value,
      modeltype: m,
    })
    // console.log(result)
    setPlotOption(result)
  }
  useEffect(() => {
    // console.log(PlotOption.id)
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
  }, [PlotOption.id, PlotOption.type]) //eslint-disable-line
  return (
    <>
      <Space>
        <span>模型类型 </span>
        <Select
          defaultValue={0}
          style={{
            width: 240,
          }}
          onChange={(value) => {
            SwitchRunEcoSpace(Selected, value)
            setModelType(value)
          }}
          options={[
            { value: 0, label: 'Basic PDE' },
            { value: 1, label: 'IBM' },
            { value: 2, label: 'Multi-stanza' },
          ]}
        />
        <span>变量选择</span>
        <Select
          defaultValue={'Biomass_relative'}
          style={{
            width: 240,
          }}
          onChange={(value) => {
            SwitchRunEcoSpace(value, ModelType)
            setSelected(value)
          }}
          options={SelectOptions}
        />
      </Space>
      <div id="RunEcoSpace" style={{ height: '88%' }}></div>
    </>
  )
}
