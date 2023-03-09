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
import { AppstoreOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { LayerOutlined } from "../../components/icons";
import Sidebar from "../../features/sidebar";
import useMapPositionStore from "../../stores/map_postion_store";
import { MapView, MapStatus } from "../../features/map";
import { LayerPanel } from "../../features/layer";
import { CasePanel } from "../../features/case";
import { DataPanel } from "../../features/data";

const View = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-flow: column;
`;

// TitleBar container
const TitleBarContainer = styled.div`
  height: 56px;
  line-height: 56px;
  font-size: 20px;
  background: #fff;
  padding-left: 20px;
  border-bottom: 1px solid #d9d9d9;
`;
// conent container
const ContentContainer = styled.div`
  display: flex;
  flex: 1 1 0;
`;
// MapContainer 样式
const MapContainer = styled.div`
  position: relative;
  flex: 1 1 0;
`;

/**
 * @description Home 组件
 * @module Home
 * @Author xiaohan kong
 * @export module: Home
 */
const Home: React.FC = () => {
  const position = useMapPositionStore((state) => state.position);

  // 侧边栏数据
  const sidebarItemsLeft = [
    {
      title: "DatabaseOutlined",
      id: "data",
      icon: <CloudUploadOutlined style={{ color: "#fafafa", fontSize: "22px" }} />,
      panel: <DataPanel />,
    },
    {
      title: "图层",
      id: "layer",
      icon: <LayerOutlined style={{ color: "#fafafa", fontSize: "22px" }} />,
      panel: <LayerPanel />,
    },
    {
      title: "案例",
      id: "case",
      icon: <AppstoreOutlined style={{ color: "#fafafa", fontSize: "22px" }} />,
      panel: <CasePanel url={"/case/list"} />,
    },
  ];

  // NOTE 弹窗设计思想
  return (
    <View>
      <TitleBarContainer>港口水环境与生态动力学精细化模拟平台</TitleBarContainer>
      <ContentContainer>
        <Sidebar items={sidebarItemsLeft} />
        <MapContainer>
          <MapView />
          <MapStatus position={position} />
        </MapContainer>
        <Sidebar items={[]} position="right" style={{ background: "#fff" }}></Sidebar>
      </ContentContainer>
    </View>
  );
};

export default Home;
