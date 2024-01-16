import React, { useEffect }from 'react'
import * as echarts from 'echarts';
import { RunEcoSim_Option } from '../../store';
import { Space,Select } from 'antd';
import axios from 'axios';
import { serverHost } from '../../../../config/global_variable';
const SelectOptions = [
    { value: 'Biomass_relative', label: 'Biomass_relative' },
    { value: 'Biomass_absolute', label: 'Biomass_absolute' },
    { value: 'Catch_relative', label: 'Catch_relative' },
    { value: 'Catch_absolute', label: 'Catch_absolute' },
  ]

export default function RunEcoSimPlot() {
    const PlotOption = RunEcoSim_Option((state) => state.Data)
    const setPlotOption = RunEcoSim_Option((state) => state.setData)
    const SwitchRunEcosim = (value)=>{
        axios({
            method: "post",
            baseURL: serverHost + "/api/model/RunEcoSim_Switch",
            data: { id: value },
        }).then((response) => {
            if (response.status === 200) {
                setPlotOption(response.data)
            } 
        });
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

