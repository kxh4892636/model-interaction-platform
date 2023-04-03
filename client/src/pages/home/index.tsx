/*
 * @File: Home component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components/macro";
import {
  AppstoreOutlined,
  CloudUploadOutlined,
  BgColorsOutlined,
  MediumOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { LayerOutlined } from "../../components/icons";
import Sidebar from "../../features/sidebar";
import useMapPositionStore from "../../stores/map_postion_store";
import { MapView, MapStatus } from "../../features/map";
import { LayerPanel } from "../../features/layer";
import { CasePanel } from "../../features/case";
import { DataPanel } from "../../features/data";
import { StylePanel } from "../../features/style";
import Model from "../../features/model/App";
import { SavePanel } from "../../features/save";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ModelPopup } from "../../components/popup";
import usePopupStore from "../../stores/popup_store";
import { ProjectView } from "../../features/project";
import useProjectStatusStore from "../../stores/project_status_store";

const View = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-flow: column;
`;

// TitleBar container
const TitleBarContainer = styled.div`
  height: 6vh;
  line-height: 6vh;
  font-size: 20px;
  background: #fcfcfc;
  padding-left: 20px;
  border-bottom: 1px solid #d9d9d9;
`;
// conent container
const ContentContainer = styled.div`
  display: flex;
  height: 91vh;
`;
// MapContainer 样式
const ViewContainer = styled.div`
  position: relative;
  flex: 1 1 0;
`;
// TitleBar container
const StatusBarContainer = styled.div`
  height: 3vh;
  display: flex;
  background: #f5f5f5;
  border-top: 1px solid #d9d9d9;
  align-items: center;
`;

/**
 * @description Home 组件
 * @module Home
 * @Author xiaohan kong
 * @export module: Home
 */
const Home: React.FC = () => {
  const position = useMapPositionStore((state) => state.position);
  const popupTag = usePopupStore((state) => state.popupTagStore);
  const setModelPopupTag = usePopupStore((state) => state.setModelPopupTag);
  const popup = usePopupStore((state) => state.popupStore);
  const setModelPopup = usePopupStore((state) => state.setModelPopup);
  const projectKey = useProjectStatusStore((state) => state.key);

  // 侧边栏数据
  const sidebarItemsLeft = [
    {
      title: "数据",
      id: "data",
      icon: <CloudUploadOutlined style={{ color: "#fafafa", fontSize: "24px" }} />,
      panel: <DataPanel />,
    },
    {
      title: "图层",
      id: "layer",
      icon: <LayerOutlined style={{ color: "#fafafa", fontSize: "24px" }} />,
      panel: <LayerPanel />,
    },
    {
      title: "数据集",
      id: "case",
      icon: <AppstoreOutlined style={{ color: "#fafafa", fontSize: "24px" }} />,
      panel: <CasePanel />,
    },
    {
      title: "保存",
      id: "save",
      icon: <SaveOutlined style={{ color: "#fafafa", fontSize: "22px" }} />,
      panel: <SavePanel />,
    },
  ];

  const sidebarItemsRight = [
    {
      title: "样式",
      id: "style",
      icon: <BgColorsOutlined style={{ color: "#262626", fontSize: "24px" }} />,
      panel: <StylePanel />,
    },
    {
      title: "模型",
      id: "model",
      icon: <MediumOutlined style={{ color: "#262626", fontSize: "24px" }} />,
      panel: <Model />,
    },
    // {
    //   title: "水动力模型",
    //   id: "hydrodynamics",
    //   icon: <SlackOutlined style={{ color: "#262626", fontSize: "24px" }} />,
    //   panel: <ModelPanel title="水动力模型面板" model="hydrodynamics" />,
    // },
  ];

  useEffect(() => {
    axios.request({ url: "http://localhost:3456/data/init", method: "get" }).then((res) => {
      console.log(res.data);
    });
    setModelPopup(<ProjectView></ProjectView>);
    setModelPopupTag(true);
  }, []);

  return (
    <View>
      <TitleBarContainer>港口水环境与生态动力学精细化模拟平台</TitleBarContainer>
      <ContentContainer>
        <Sidebar items={sidebarItemsLeft} key="left" />
        <ViewContainer>
          <MapView display={popupTag.model} />
          <MapStatus position={position} />
          {popupTag.model === true ? <ModelPopup element={popup.model}></ModelPopup> : <></>}
        </ViewContainer>
        <Sidebar items={sidebarItemsRight} position="right" key="right" theme="white"></Sidebar>
      </ContentContainer>
      <StatusBarContainer>{popupTag.model === true ? "弹窗" : "2"}</StatusBarContainer>
    </View>
  );
};

export default Home;
