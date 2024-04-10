import React, { useEffect }from 'react'
import * as echarts from 'echarts';
import { RunEcoSim_Option } from '../../../store/eweStore';
import { Space,Select } from 'antd';
import axios from 'axios';
import { postRunEcoSimSwitchAPI } from '@/api/model/model.api';
import { useMetaStore } from '@/store/metaStore'
import { eweFile } from '@/store/eweStore'
const SelectOptions = [
    { value: 'Biomass_relative', label: 'Biomass_relative' },
    { value: 'Biomass_absolute', label: 'Biomass_absolute' },
    { value: 'Catch_relative', label: 'Catch_relative' },
    { value: 'Catch_absolute', label: 'Catch_absolute' },
  ]

export default function RunEcoSimPlot() {
    const PlotOption = RunEcoSim_Option((state) => state.Data)
    const setPlotOption = RunEcoSim_Option((state) => state.setData)
    const projectID = useMetaStore((state) => state.projectID)
    const ewefile   = eweFile((state) => state.Data)
    const SwitchRunEcosim = async (value)=>{
      const result = await postRunEcoSimSwitchAPI({projectID: projectID,name:ewefile,id:value})
      setPlotOption(result.option)
    }
    useEffect(()=>{
        let myChart= echarts.getInstanceByDom(document.getElementById('RunEcoSim')); //有的话就获取已有echarts实例的DOM节点。
        if (myChart== null) { // 如果不存在，就进行初始化。
          myChart= echarts.init(document.getElementById('RunEcoSim'));
        }
        myChart.clear()
        var option = PlotOption;
        option && myChart.setOption(option);
    },[PlotOption.id])//eslint-disable-line
  return (
    <>
        <Space>
        <span>变量选择</span>
        <Select
            defaultValue={"Biomass_relative"}
            style={{
            width: 240,
            }}
            onChange={(value) => {
            SwitchRunEcosim(value);
            }}
            options={SelectOptions}
        />
        </Space>
        <div id='RunEcoSim' style={{height:"88%"}}></div>
    </>
    
  )
}

