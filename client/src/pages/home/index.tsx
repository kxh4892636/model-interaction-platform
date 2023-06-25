/*
 * @File: Home component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-07
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import {
  AppstoreOutlined,
  BgColorsOutlined,
  DatabaseOutlined,
  MediumOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import { LayerOutlined } from "../../components/icons";
import { DataPanel } from "../../features/data";
import { LayerPanel } from "../../features/layer";
import { MapStatus, MapView } from "../../features/map";
import Model from "../../features/model/App";
import { useModelsStatus } from "../../features/model/stores";
import { Nav } from "../../features/nav";
import { ProjectInfoPanel, ProjectView } from "../../features/project";
import { Sidebar } from "../../features/sidebar";
import { StylePanel } from "../../features/style";
import {
  useAnimatedStatusStore,
  useLayersStore,
  useModalStore
} from "../../stores";
import { useMapPositionStore } from "../../stores/map_postion_store";
import { useProjectStatusStore } from "../../stores/project_status_store";
import { useViewStore } from "../../stores/view_store";

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
  height: 94vh;
`;
// MapContainer 样式
const ViewContainer = styled.div`
  position: relative;
  flex: 1 1 0;
`;

/**
 * @description Home 组件
 * @module Home
 * @Author xiaohan kong
 * @export module: Home
 */
export const Home: React.FC = () => {
  const position = useMapPositionStore((state) => state.position);
  const view = useViewStore((state) => state.view);
  const viewTag = useViewStore((state) => state.viewTag);
  const setView = useViewStore((state) => state.setView);
  const setViewTag = useViewStore((state) => state.setViewTag);
  const modal = useModalStore((state) => state.modal);
  const modalTag = useModalStore((state) => state.modalTag);
  const projectKey = useProjectStatusStore((state) => state.key);
  const isSpinning = useProjectStatusStore((state) => state.isSpinning);
  const navigate = useNavigate();
  const modelStatus = useModelsStatus((state) => state.modelStatus);
  const animatedStatus = useAnimatedStatusStore(
    (state) => state.animatedStatus
  );
  const layersStore = useLayersStore(state=>state.layers)

  // 侧边栏数据
  const navItems = projectKey.includes("-")
    ? [
        {
          title: "项目",
          id: "project",
          icon: (
            <AppstoreOutlined style={{ color: "#fafafa", fontSize: "24px" }} />
          ),
          panel: <ProjectView />,
          type: "view",
        },
        {
          title: "数据",
          id: "data",
          icon: (
            <DatabaseOutlined style={{ color: "#fafafa", fontSize: "24px" }} />
          ),
          panel: <DataPanel />,
          type: "panel",
        },
        {
          title: "图层",
          id: "layer",
          icon: (
            <LayerOutlined style={{ color: "#fafafa", fontSize: "24px" }} />
          ),
          panel: <LayerPanel />,
          type: "panel",
        },
        {
          title: "模型",
          id: "model",
          icon: (
            <MediumOutlined style={{ color: "#fafafa", fontSize: "24px" }} />
          ),
          panel: <Model />,
          type: "view",
        },
        {
          title: "详情",
          id: "info",
          icon: <SaveOutlined style={{ color: "#fafafa", fontSize: "22px" }} />,
          panel: <ProjectInfoPanel />,
          type: "panel",
          position: "end",
        },
      ]
    : [
        {
          title: "项目",
          id: "project",
          icon: (
            <AppstoreOutlined style={{ color: "#fafafa", fontSize: "24px" }} />
          ),
          panel: <ProjectView />,
          type: "view",
        },
      ];

  const sidebarItems = [
    {
      title: "样式",
      id: "style",
      icon: <BgColorsOutlined style={{ color: "#262626", fontSize: "24px" }} />,
      panel: <StylePanel />,
      type: "panel",
    },
  ];

  useEffect(() => {
    setView(<ProjectView />);
    setViewTag(true);
    navigate("/project");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <TitleBarContainer
        onClick={() => {
          console.log(animatedStatus);
          console.log(modelStatus);
          console.log(layersStore);
        }}
      >
        港口水环境与生态动力学精细化模拟平台
      </TitleBarContainer>
      <Spin spinning={isSpinning} size="large" delay={500} tip="请稍等">
        <ContentContainer>
          <Nav items={navItems} />
          <ViewContainer>
            <MapView display={viewTag} />
            <MapStatus position={position} />
            {viewTag ? view : <></>}
          </ViewContainer>
          <Sidebar
            items={projectKey.includes("-") ? sidebarItems : []}
          ></Sidebar>
        </ContentContainer>
      </Spin>
      {modalTag ? modal : <></>}
    </View>
  );
};
