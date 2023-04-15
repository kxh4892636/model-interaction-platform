import React from 'react'
import { Table,Alert } from 'antd';
import {fakedataV} from "../store"
// 模型平衡与否 已极不平衡时的功能组名称
let status = ""
let statusname = ""
export default function App() {
    // 在这定义将由计算的出的值，标记为红色与蓝色
    const EcocolumnsModal = [
        {
          title: 'Trophic Level/Flow',
          dataIndex: 'Level',
          key: 'Level',
        },
        {
          title: 'Import',
          dataIndex: 'Import',
          key: 'Import',
        },
        {
          title: 'Consumption by predators',
          dataIndex: 'ConPre',
          key: 'ConPre',
        },
        {
          title: 'Export',
          dataIndex: 'Export',
          key: 'Export',
        },
        {
          title: 'Flow to detritus',
          dataIndex: 'FlowToD',
          key: 'FlowToD',
        },
        {
          title: 'Respiration',
          dataIndex: 'Resp',
          key: 'Resp',
        },
        {
            title: 'Throughput',
            dataIndex: 'Through',
            key: 'Through',
        },
    ];
    const fakedata  = {
      Level:["IX","VIII","VII","VI","V","IV","III","II","I","Sum"],
      Import:[0,0,0,0,0,0,0,0,0,0],
      ConPre:[0,0.00000038,0.00002222,0.0005568,0.007955,0.6812,0.8802,34.115,34.115,955.14,990,21],
      Export:[0,0.00000128,0.00003128,0.0004215,0.003211,0.0248,0.7464,7.7062,3480.3,3488.7],
      FlowToD:[0,0.00000882,0.000222,0.003104,0.02524,0.3373,13.542,334.38,0,348.29],
      Resp:[0,0.00001146,0.0002813,0.003874,0.3171,0.4499,18.947,578.93,0,598.37],
      Through:[0,0.00002194,0.0005568,0.007955,0.06812,0.8802,34.115,955.14,4435.4,5425.6]
  }
  const fakedata2  = {
    Level:["IX","VIII","VII","VI","V","IV","III","II","I","Sum"],
    Import:[0,0,0,0,0,0,0,0,0,0],
    ConPre:[0,0.00000107,0.00005674,0.001247,0.01555,0.1205,2.16,89.470,2152.4,2244.1],
    Export:[0.00000007,0.00000326,0.00006938,0.0008062,0.005456,0.05574,1.9556,7.5515,0,9.5692],
    FlowToD:[0.00000043,0.00002255,0.0004958,0.006011,0.04384,0.8473,35.502,717.57,3333.1,4087.1],
    Resp:[0.00000061,0.00002910,0.0006253,0.007485,0.05564,1.1365,49.852,1337.8,0,1388.8],
    Through:[0.00000111,0.00005597,0.001247,0.01555,0.1205,2.16,89.47,2152.4,5485.5,7729.6]
}
    const tabledata = []
    for(let i=0;i<fakedata.Level.length;i++){
        let tmp={}
        tmp.key = fakedata.Level[i]
        tmp.Level = fakedata.Level[i]
        tmp.Import = fakedata.Import[i]+fakedata2.Import[i]
        tmp.ConPre = fakedata.ConPre[i]+fakedata2.ConPre[i]
        tmp.Export = fakedata.Export[i]+fakedata2.Export[i]
        tmp.FlowToD= fakedata.FlowToD[i]+fakedata2.FlowToD[i]
        tmp.Resp = fakedata.Resp[i]+fakedata2.Resp[i]
        tmp.Through = fakedata.Through[i]+fakedata2.Through[i]
        tabledata.push(tmp)
    }
    // 数据总统
    const fakedataVV = fakedataV((state)=>state.fakedataV)
    return (
      <>
        {status==="Balanced"?<Alert message="Success 模型平衡" type="success" showIcon />:<></>}
        {status==="UnBalanced"?<Alert message="Error" description={<>模型不平衡 以下功能组的EE大于1:<b>{statusname}</b></>} type="error"showIcon/>:<></>}
        {fakedataVV?
          <>
            <div style={{fontSize:25,fontWeight:800}}>港口海域生态系统综合能流</div>
            <br/>
            <Table
          // components={components}
          // rowClassName={() => 'editable-row'}
          bordered
          dataSource={tabledata}
          columns={EcocolumnsModal}
          pagination={{ pageSize:100 }}
          scroll={{y:500}}
          size="small"
          // style={{width:500}}
        />
          </>
          :<h1>等待运行结果</h1>}

      </>

    )
}
