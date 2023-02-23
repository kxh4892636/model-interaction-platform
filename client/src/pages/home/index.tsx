/*
 * @File: Home component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components";
import { AppstoreOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { LayerOutlined } from "../../components/icons";
import Sidebar from "../../features/sidebar";
import useMapPositionStore from "../../stores/map_postion_store";
import { MapView, MapStatus } from "../../features/map";
import { LayerPanel } from "../../features/layer";
import { CasePanel } from "../../features/case";
import { DataPanel } from "../../features/data";

// TitleBar container
// NOTE 使用变量 ${}
const TitleBarContainer = styled.div`
  height: 6vh;
  line-height: 6vh;
  font-size: 20px;
  background: #fff;
  padding-left: 20px;
  border-bottom: 1px solid #d9d9d9;
`;
// conent container
const ContentContainer = styled.div`
  display: flex;
`;
// MapContainer 样式
const MapContainer = styled.div`
  position: relative;
  height: 94vh;
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

  return (
    <>
      <TitleBarContainer>港口水环境与生态动力学精细化模拟平台</TitleBarContainer>
      <ContentContainer>
        <Sidebar items={sidebarItemsLeft} />
        <MapContainer>
          <MapView />
          <MapStatus position={position} />
        </MapContainer>
        <Sidebar items={[]} position="right" style={{ background: "#fff" }}></Sidebar>
      </ContentContainer>
    </>
  );
};

export default Home;
