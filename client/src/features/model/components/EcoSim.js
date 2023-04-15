import React from 'react'
import { Table } from 'antd';
import {fakedataV} from "../store"
export default function App() {
    // 在这定义将由计算的出的值，标记为红色与蓝色
    const EcocolumnsModal = [
        {
          title: 'Group',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'StartBio',
          dataIndex: 'StartBio',
          key: 'StartBio',
        },
        {
          title: 'EndBio',
          dataIndex: 'EndBio',
          key: 'EndBio',
        },
        {
          title: 'BioES',
          dataIndex: 'BioES',
          key: 'BioES',
        },
        {
          title: 'StartCatch',
          dataIndex: 'StartCatch',
          key: 'StartCatch',
        },
        {
          title: 'EndCatch',
          dataIndex: 'EndCatch',
          key: 'EndCatch',
        },
        {
            title: 'CatchES',
            dataIndex: 'CatchES',
            key: 'CatchES',
        },
    ];
    const fakedata = {
        Group: [
            "Outside",
            "Lophius",
            "Sebastes",
            "Liparidae",
            "Chaeturi",
            "Otherfish",
            "Shrimp",
            "Crab",
            "Siphono",
            "Annulata",
            "Echinoder",
            "Zooplan",
            "Phytoplan",
            "Detritus",
            "Discards",
            "Fleet1"
        ],
        StartBio: [
            1,
            0.0731000006198883,
            0.016499999910593,
            0.0210999995470047,
            0.0359999984502792,
            0.0807000026106834,
            0.122900001704693,
            0.0661899968981743,
            0.0573999993503094,
            14.8699998855591,
            15,
            12.5500001907349,
            23.8500003814697,
            120,
            0,
            0
        ],
        EndBio: [
            1,
            0.0731000025640379,
            0.0165000010716437,
            0.0211000046603687,
            0.0360000001621069,
            0.0807000030806722,
            0.12290000475608,
            0.066189995581045,
            0.0574000002561395,
            14.8700005084351,
            15.0000009730518,
            12.5500000428967,
            23.850000389165,
            120.000000184377,
            0,
            0
        ],
        BioES: [
            1,
            1.00000002659575,
            1.00000007036671,
            1.00000024233953,
            1.00000004755077,
            1.0000000058239,
            1.00000002482821,
            0.999999980100781,
            1.00000001578101,
            1.0000000418881,
            1.00000006487012,
            0.999999988220066,
            1.00000000032265,
            1.00000000153648,
            "NaN",
            "NaN"
        ],
        StartCatch: [
            0,
            0.043839998451893,
            0.00989000046881566,
            0.0126400005627023,
            0.00218000008509743,
            0.0364300017927242,
            0.00316999995684207,
            0.0157099999056701,
            0.00440000002530914,
            8.92200004727346,
            9.00000021933781,
            0,
            0,
            0,
            "NaN",
            0
        ],
        EndCatch: [
            0,
            0.0438399997092733,
            0.00989000103180883,
            0.0126400033839641,
            0.00218000017227951,
            0.0364300014710352,
            0.00317000000226263,
            0.0157099996361292,
            0.00440000004559997,
            8.92200030506101,
            9.00000058383107,
            0,
            0,
            0,
            "NaN",
            0
        ],
        CatchES: [
            "NaN",
            1.00000002868112,
            1.0000000569255,
            1.00000022320108,
            1.00000003999177,
            0.999999991169669,
            1.00000001432825,
            0.999999982842717,
            1.00000000461155,
            1.00000002889347,
            1.00000004049925,
            "NaN",
            "NaN",
            "NaN",
            "NaN",
            "NaN"
        ]
    }
    const tabledata = []
    for(let i=0;i<fakedata.Group.length;i++){
        let tmp={}
        tmp.key = fakedata.Group[i]
        tmp.name = fakedata.Group[i]
        tmp.StartBio = fakedata.StartBio[i]
        tmp.EndBio = fakedata.EndBio[i]
        tmp.BioES = fakedata.BioES[i]
        tmp.StartCatch = fakedata.StartCatch[i]
        tmp.EndCatch = fakedata.EndCatch[i]
        tmp.CatchES = fakedata.CatchES[i]
        tabledata.push(tmp)
    }
    const fakedataVV = fakedataV((state)=>state.fakedataV)
    return (
      <>
        {fakedataVV?
        <>
        <div style={{fontSize:25,fontWeight:800}}>港口海域生态系统功能组生物量动态变化</div>
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
