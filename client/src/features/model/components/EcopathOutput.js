import React from "react";
import { Table, Button, message, Alert } from "antd";
import {
  Basic,
  Diet,
  FleetModal,
  Detritus,
  FisheryDiscardFate,
  FisheryLand,
  FisheryDiscard,
  EcopathOutput,
  FlowDiagram,
  RunModelState,
  ModifyState,
  selectedEWEModelID,
  fakedataV
} from "../store";
import axios from "axios";
// 模型平衡与否 已极不平衡时的功能组名称
let status = "";
let statusname = "";
export default function App() {
  // 在这定义将由计算的出的值，标记为红色与蓝色
  const EcocolumnsModal = [
    {
      title: "Group",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "TL",
      dataIndex: "TL",
      key: "TL",
      render: (element) => <span style={{ color: "blue" }}>{element}</span>,
    },
    {
      title: "Biomass",
      dataIndex: "Biomass",
      key: "Biomass",
      render: (element, { BiomassFlag }) =>
        BiomassFlag === 1 ? (
          <span style={{ color: "#f20c00" }}>{element}</span>
        ) : (
          <span style={{ color: "black" }}>{element}</span>
        ),
    },
    {
      title: "PB",
      dataIndex: "PB",
      key: "PB",
      render: (element, { PBFlag }) =>
        PBFlag === 1 ? (
          <span style={{ color: "#f20c00" }}>{element}</span>
        ) : (
          <span style={{ color: "black" }}>{element}</span>
        ),
    },
    {
      title: "QB",
      dataIndex: "QB",
      key: "QB",
      render: (element, { QBFlag }) =>
        QBFlag === 1 ? (
          <span style={{ color: "#f20c00" }}>{element}</span>
        ) : (
          <span style={{ color: "black" }}>{element}</span>
        ),
    },
    {
      title: "EE",
      dataIndex: "EE",
      key: "EE",
      render: (element, { EEFlag }) =>
        EEFlag === 1 ? (
          <span style={{ color: "#f20c00" }}>{element}</span>
        ) : (
          <span style={{ color: "black" }}>{element}</span>
        ),
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
  const Fleet = FleetModal((state) => state.FleetData);
  const DetritusData = Detritus((state) => state.DetritusData);
  const FDiscardFateData = FisheryDiscardFate((state) => state.DiscardFateData);
  const FLandData = FisheryLand((state) => state.LandData);
  const FDiscardData = FisheryDiscard((state) => state.DiscardData);
  const EcopathData = EcopathOutput((state) => state.EcopathOutputData);
  const setEcopathOutputData = EcopathOutput((state) => state.setEcopathOutputData);
  const setGraphData = FlowDiagram((state) => state.setGraphData);
  const ModelState = RunModelState((state) => state.State);
  const setModelState = RunModelState((state) => state.setState);
  const ModifyData = ModifyState((state) => state.ModifyData);
  const selectedEWElID = selectedEWEModelID((state) => state.selectedEWEModelID);
  const setfakedataV = fakedataV((state)=>state.setfakedataV)
  // Run Ecopath
  const RunEcopath = () => {
    // console.log(GroupTData,DietData)
    if (ModelState === "Start" || ModelState === "Modify") {
      message.loading({ content: "数据计算中", key: "Mloading" });
    }
    axios({
      method: "post",
      baseURL: "http://localhost:3456/api/model/R_test2",
      // 根据第一次还是修改，传输不同的数据
      data:
        ModelState === "Start"
          ? {
              Group: GroupTData,
              Diet: DietData,
              Fleet: Fleet,
              Detritus: DetritusData,
              DiscardFate: FDiscardFateData,
              Land: FLandData,
              Discard: FDiscardData,
              singleID: selectedEWElID,
              ModelState: ModelState,
            }
          : // GroupTData用于后端生成GroupID，数据库中的很多表没有存功能群组的名字，而是ID
            {
              ModelState: ModelState,
              ModifyData: ModifyData,
              singleID: selectedEWElID,
              Group: GroupTData,
              Fleet: Fleet,
            },
    }).then((response) => {
      console.log(response);
      if (ModelState === "Start" || ModelState === "Modify") {
        message.destroy("Mloading");
        // console.log(response)
        status = response.data.status;
        // [1,2,3,4,5,6,7,8,9,0]  toString()把数组转换为字符串  “1,2,3,4,5,6,7,8,9,0”
        statusname = response.data.statusname.toString();
        message.success(`计算完成！！！`);
        setEcopathOutputData(response.data.BasicEst);
        setGraphData(response.data.Graph);
        setfakedataV(true)
      } else {
        message.warning("请勿重复点击", 0.5);
      }
      // 无论如何，执行完一次后将模型状态设为“end”结束
      setModelState("End");
    });
  };

  return (
    <>
      {status === "Balanced" ? <Alert message="Success 模型平衡" type="success" showIcon /> : <></>}
      {status === "UnBalanced" ? (
        <Alert
          message="Error"
          description={
            <>
              模型不平衡 以下功能组的EE大于1:<b>{statusname}</b>
            </>
          }
          type="error"
          showIcon
        />
      ) : (
        <></>
      )}
      <br />
      <Table
        // components={components}
        // rowClassName={() => 'editable-row'}
        bordered
        dataSource={EcopathData}
        columns={EcocolumnsModal}
        pagination={{ pageSize: 100 }}
        scroll={{ y: 500 }}
        size="small"
        // style={{width:500}}
      />
      <Button
        style={{ backgroundColor: "#ff4d4f", color: "white", display: "block" }}
        onClick={RunEcopath}
      >
        Run Ecopath
      </Button>
    </>
  );
}
