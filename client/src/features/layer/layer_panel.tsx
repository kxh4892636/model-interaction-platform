/*
 * @File: LayerPanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-04
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import {
  FolderAddOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Button, Input } from "antd";
import styled from "styled-components";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
} from "../../components/layout";
import LayerTool from "./components/layer_tool";
import LayersTree from "./components/layer_tree/layer_tree";
import LayerTreeMenu from "./components/layer_tree_menu";
import useLayerActions from "./hooks/use_layer_actions";

// RenameInput style
const StyledDiv = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  flex-flow: column;
  background: #fafafa;
  width: 180px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  left: 4vw;
  top: 16vh;
  z-index: 9;
`;

type AppProps = {
  setshowRenameInput: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * @description ReanmeInput component, pop up it after clicking rename in layerMenu
 * @Author xiaohan kong
 * @param setshowRenameInput click event for the top left close symbol, close the RenameInput component
 */
const RenameInput = ({ setshowRenameInput }: AppProps) => {
  const [inputValue, setInputValue] = useState("");
  const layerActions = useLayerActions();

  return (
    <StyledDiv>
      <div style={{ marginInlineEnd: "auto", padding: "10px" }}>重命名工具</div>
      <Input
        style={{
          width: "150px",
          marginBlockEnd: "10px",
        }}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <Button
        type="default"
        style={{ marginBlockEnd: "10px" }}
        onClick={() => {
          layerActions.renameLayer(inputValue);
          setshowRenameInput(false);
        }}
      >
        重命名
      </Button>
    </StyledDiv>
  );
};

/**
 * @description LayerPanel
 * @module LayerPanel
 * @author xiaohan kong
 * @export module: LayerPanel
 */
const LayerPanel = () => {
  const [showRenameInput, setshowRenameInput] = useState(false);
  const layerActions = useLayerActions();

  const layerMenuItems = [
    {
      key: "rename",
      label: "重命名该图层",
      action: () => {
        setshowRenameInput(true);
      },
    },
    // {
    //   key: "center",
    //   label: "图层居中显示",
    //   action: "",
    // },
    {
      key: "delete",
      label: "删除该图层",
      action: layerActions.deleteLayer,
    },
  ];

  return (
    <PanelContainer>
      <PanelTitleContainer>图层面板</PanelTitleContainer>
      <PanelToolsContainer>
        <LayerTool
          title={"创建图层集合"}
          icon={<FolderAddOutlined />}
          action={() => {
            layerActions.createLayerGroup();
          }}
        />
        <LayerTool
          title={"显示所有图层"}
          icon={<EyeOutlined />}
          action={() => {
            layerActions.showAllLayers(true);
          }}
        />
        <LayerTool
          title={"隐藏所有图层"}
          icon={<EyeInvisibleOutlined />}
          action={() => {
            layerActions.showAllLayers(false);
          }}
        />
        <LayerTool
          title={"展开所有图层"}
          icon={<VerticalAlignBottomOutlined />}
          action={() => {
            layerActions.expandAllLayers(true);
          }}
        />
        <LayerTool
          title={"折叠所有图层"}
          icon={<VerticalAlignTopOutlined />}
          action={() => {
            layerActions.expandAllLayers(false);
          }}
        />
        <LayerTool
          title={"删除所有图层"}
          icon={<DeleteOutlined />}
          action={() => {
            layerActions.deleteAllLayers();
          }}
        />
      </PanelToolsContainer>
      <PanelContentContainer>
        <LayersTree>
          <LayerTreeMenu layerMenuItems={layerMenuItems} />
        </LayersTree>
      </PanelContentContainer>
      {showRenameInput ? <RenameInput setshowRenameInput={setshowRenameInput} /> : <></>}
    </PanelContainer>
  );
};

export default LayerPanel;
