import React, { useEffect } from 'react'
import { Space,Select,Table,Tag } from 'antd';
import * as echarts from "echarts"
import { StanzeSelect,StanzeSelectedValue,StanzeGroup,StanzeTable,StanzePlotOption } from '../../store';
const StanzeColumns = [
    {
        title: 'LifeStage',
        dataIndex: 'LifeStage',
        key: 'LifeStage',
    },
    {
        title: 'StartAge',
        dataIndex: 'StartAge',
        key: 'StartAge',
    },
    {
        title: 'LeadingB',
        dataIndex: 'LeadingB',
        key: 'LeadingB',
        render: (_, item) => (
            <>
              {
                item.LeadingB===item.LifeStage?<Tag color={'green'} key={item.LeadingB}>{"YES"}</Tag>:<></>
              }
            </>
          ),
    },
    {
        title: 'Biomass',
        dataIndex: 'Biomass',
        key: 'Biomass',
    },
    {
        title: 'TotalMort',
        dataIndex: 'TotalMort',
        key: 'TotalMort',
    },
    {
        title: 'LeadingCB',
        dataIndex: 'LeadingCB',
        key: 'LeadingCB',
        render: (_, item) => (
            <>
              {
                item.LeadingCB===item.LifeStage?<Tag color={'green'} key={item.LeadingCB}>{"YES"}</Tag>:<></>
              }
            </>
          ),
    },
    {
        title: 'CB',
        dataIndex: 'CB',
        key: 'CB',
    },
    {
        title: 'Spaw',
        dataIndex: 'Spaw',
        key: 'Spaw',
    },
]
export default function StanzeGroupJS() {
    useEffect(()=>{
        let myChart= echarts.getInstanceByDom(document.getElementById('StanzePlot')); //有的话就获取已有echarts实例的DOM节点。
        if (myChart== null) { // 如果不存在，就进行初始化。
          myChart= echarts.init(document.getElementById('StanzePlot'));
        }
        myChart.clear()
        myChart.setOption(StanzePlotOptionD);
    })
    const SelectOption = StanzeSelect((state) => state.Data)
    const StanzeData = StanzeGroup((state) => state.Data)
    const StanzeTableD = StanzeTable((state) => state.Data)
    const StanzePlotOptionD = StanzePlotOption((state) => state.Data)
    const StanzeSelectedValueD = StanzeSelectedValue((state) => state.Data)
    const setStanzeTable = StanzeTable((state) => state.setData)
    const setStanzePlotOption = StanzePlotOption((state) => state.setData)
    const setStanzeSelectedValue = StanzeSelectedValue((state) => state.setData)
  return (
    <div style={{height:"80%",width:"100%"}}>
        <div style={{height:"5%",width:"100%"}}>
            <Space>
            <span>物种选择</span>
            <Select
                value={StanzeSelectedValueD}
                style={{
                width: 240,
                }}
                onChange={(value) => {
                    // SwitchRunEcosim(value);
                    // console.log(StanzeData[value])
                    setStanzeSelectedValue(value)
                    setStanzeTable(StanzeData[value].LifeStageTable)
                    setStanzePlotOption(StanzeData[value].option)
                }}
                options={SelectOption}
            />
            </Space>
        </div>
        <div id="StanzePlot" style={{height:"50%"}}></div>
        <div id="StanzeTable" style={{height:"25%"}}>
            <Table dataSource={StanzeTableD} columns={StanzeColumns}></Table>
        </div>
    </div>
  )
}
