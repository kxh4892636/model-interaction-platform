import React, { useEffect }from 'react'
import * as echarts from 'echarts';
import { RunEcoSim_validate } from '../../../store/eweStore';
import { Space,Select } from 'antd';
import axios from 'axios';
const SelectOptions = [
    { value: 'Biomass_relative', label: 'Biomass_relative' },
    { value: 'Biomass_absolute', label: 'Biomass_absolute' },
    { value: 'Catch_relative', label: 'Catch_relative' },
    { value: 'Catch_absolute', label: 'Catch_absolute' },
  ]

export default function RunEcoSimPlot_validate() {
    const PlotOption = RunEcoSim_validate((state) => state.Data)
    useEffect(()=>{
        let myChart= echarts.getInstanceByDom(document.getElementById('RunEcoSim_validate')); //有的话就获取已有echarts实例的DOM节点。
        if (myChart== null) { // 如果不存在，就进行初始化。
          myChart= echarts.init(document.getElementById('RunEcoSim_validate'));
        }
        myChart.clear()
        var option = PlotOption;
        option && myChart.setOption(option);
    },[PlotOption.id])//eslint-disable-line
  return (
    <div style={{textAlign: 'center',height:"100%"}}>
      <div style={{marginBottom:"10px",fontWeight: 'bold'}}>生物量验证图</div>
        <div id='RunEcoSim_validate' style={{height:"88%"}}></div>
    </div>
    
  )
}

