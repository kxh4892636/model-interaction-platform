import React from 'react'
import { Table,Button,message } from 'antd';
import {Basic,Diet,FleetModal,Detritus,FisheryDiscardFate,FisheryLand,FisheryDiscard,EcopathOutput,FlowDiagram} from "../store"
import axios from 'axios';
export default function App() {
    // 在这定义将由计算的出的值，标记为红色与蓝色
    const EcocolumnsModal = [
        {
          title: 'Group',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'TL',
          dataIndex: 'TL',
          key: 'TL',
          render: (element) => <span style={{color: 'blue'}}>{element}</span>,
        },
        {
          title: 'Biomass',
          dataIndex: 'Biomass',
          key: 'Biomass',
          render: (element,{BiomassFlag}) => BiomassFlag === 1? <span style={{color: '#f20c00'}}>{element}</span>:
          <span style={{color: 'black'}}>{element}</span>
        },
        {
          title: 'PB',
          dataIndex: 'PB',
          key: 'PB',
          render: (element,{PBFlag}) => PBFlag === 1? <span style={{color: '#f20c00'}}>{element}</span>:
          <span style={{color: 'black'}}>{element}</span>
        },
        {
          title: 'QB',
          dataIndex: 'QB',
          key: 'QB',
          render: (element,{QBFlag}) => QBFlag === 1? <span style={{color: '#f20c00'}}>{element}</span>:
          <span style={{color: 'black'}}>{element}</span>
        },
        {
          title: 'EE',
          dataIndex: 'EE',
          key: 'EE',
          render: (element,{EEFlag}) => EEFlag === 1? <span style={{color: '#f20c00'}}>{element}</span>:
          <span style={{color: 'black'}}>{element}</span>
        },
        // {
        //   title: 'GE',
        //   dataIndex: 'GE',
        //   key: 'GE',
        //   render:element => <span style={{color: 'red'}}>{element}</span>
        // },  
        // {
        //   title: 'BA',
        //   dataIndex: 'BA',
        //   key: 'BA',
        //   render:element => <span style={{color: 'red'}}>{element}</span>
        // },
        // {
        //   title: 'TL',
        //   dataIndex: 'TL',
        //   key: 'TL',
        //   render:element => <span style={{color: 'red'}}>{element}</span>
        // },
        // {
        //   title: 'Unassim',
        //   dataIndex: 'Unassim',
        //   key: 'Unassim',
        //   render: (element,{UnassimFlag}) => UnassimFlag === 1? <span style={{color: 'red'}}>{element}</span>:
        //   <span style={{color: 'black'}}>{element}</span>
        // },
    ];
    
    // 数据总统
    const GroupTData = Basic((state) => state.GroupTData);
    const DietData = Diet((state) => state.DietData);
    const Fleet = FleetModal((state) => state.FleetData)
    const DetritusData = Detritus((state) => state.DetritusData)
    const FDiscardFateData = FisheryDiscardFate((state) => state.DiscardFateData)
    const FLandData = FisheryLand((state) => state.LandData)
    const FDiscardData = FisheryDiscard((state) => state.DiscardData)
    const EcopathData = EcopathOutput((state) => state.EcopathOutputData );
    const setEcopathOutputData = EcopathOutput((state)=>state.setEcopathOutputData)
    const setGraphData = FlowDiagram((state)=>state.setGraphData)

    // Run Ecopath
    const RunEcopath = ()=>{
      // console.log(GroupTData,DietData)
      message.loading({content:"数据计算中",key:"Mloading"})
      axios({
        method:'post', 
        baseURL: 'http://localhost:3456/model/R_test2',
        data:{Group:GroupTData,Diet:DietData,Fleet:Fleet,Detritus:DetritusData,DiscardFate:FDiscardFateData,Land:FLandData,Discard:FDiscardData,singleID:sessionStorage.getItem('key').slice(10,14)}
      }).then(response=>{ 
        message.destroy("Mloading")
        // console.log(response)
        message.success(`计算完成！！！`);
        setEcopathOutputData(response.data.BasicEst)
        setGraphData(response.data.Graph)
      })
    }
    return (
      <>
        <Table
          // components={components}
          // rowClassName={() => 'editable-row'}
          bordered
          dataSource={EcopathData}
          columns={EcocolumnsModal}
          pagination={{ pageSize:100 }}
          scroll={{y:500}}
          size="small"
          // style={{width:500}}
        />
        <Button style = {{backgroundColor:"#ff4d4f",color:"white",display:"block"}} onClick={RunEcopath}>Run Ecopath</Button>
      </>

    )
}
