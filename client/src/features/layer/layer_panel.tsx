/*
 * @File: LayerPanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
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
import useMapStore from "../../stores/map_store";
import useLayersStore from "../../stores/layers_store";
import useLayersStatusStore from "../../stores/layers_status_store";
import { useKeys } from "../../hooks";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
} from "../../components/layout";
import LayerTool from "./components/layer_tool";
import LayersTree from "./components/layer_tree/layer_tree";
import LayerTreeMenu from "./components/layer_tree_menu";
import { Layer } from "../../types";

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
  const renameLayer = useLayerActions("rename");

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
          renameLayer(inputValue);
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
  const createLayerGroup = useLayerActions("group");
  const showAllLayers = useLayerActions("showAll");
  const expandAllLayers = useLayerActions("expandAll");
  const deleteAllLayers = useLayerActions("deleteAll");

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
      action: useLayerActions("delete"),
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
            createLayerGroup();
          }}
        />
        <LayerTool
          title={"显示所有图层"}
          icon={<EyeOutlined />}
          action={() => {
            showAllLayers(true);
          }}
        />
        <LayerTool
          title={"隐藏所有图层"}
          icon={<EyeInvisibleOutlined />}
          action={() => {
            showAllLayers(false);
          }}
        />
        <LayerTool
          title={"展开所有图层"}
          icon={<VerticalAlignBottomOutlined />}
          action={() => {
            expandAllLayers(true);
          }}
        />
        <LayerTool
          title={"折叠所有图层"}
          icon={<VerticalAlignTopOutlined />}
          action={() => {
            expandAllLayers(false);
          }}
        />
        <LayerTool
          title={"删除所有图层"}
          icon={<DeleteOutlined />}
          action={() => {
            deleteAllLayers();
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

/**
 * @description LayerPanel action
 * @autor xiaohan kong
 * @param action return function corresponding to the action, now actions have showAll, expandAll, delete, reanme and group
 */
const useLayerActions = (action: string) => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const deleteLayerBykey = useLayersStore((state) => state.deleteLayer);
  const updateLayer = useLayersStore((state) => state.updateLayer);
  const getLayerKeys = useKeys("layer");
  const getGroupKeys = useKeys("group");
  const getAllKeys = useKeys("all");
  const setLayersChecked = useLayersStatusStore((state) => state.setLayersChecked);
  const setLayersExpanded = useLayersStatusStore((state) => state.setLayersExpanded);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);
  const removeLayersChecked = useLayersStatusStore((state) => state.removeLayersChecked);
  const removeLayersExpanded = useLayersStatusStore((state) => state.removeLayersExpanded);
  const layersSelected = useLayersStatusStore((state) => state.layersSelected);

  /**
   * show or hide all layers by show
   * @param show true: show; false: hide
   */
  const showAllLayers = (show: boolean) => {
    const layerKeys = getLayerKeys(layers);
    const allKeys = getAllKeys(layers);

    setLayersChecked(show ? allKeys! : []);
    for (const key of layerKeys!) {
      map!.setLayoutProperty(key, "visibility", show ? "visible" : "none");
    }
  };

  /**
   * expand or collapse all layers by expand
   * @param expand true: expand; false: collapse
   */
  const expandAllLayers = (expand: boolean) => {
    const groupKeys = getGroupKeys(layers);
    if (expand) {
      setLayersExpanded(groupKeys);
    } else {
      setLayersExpanded([]);
    }
  };

  /**
   * delete layer that is selected now
   */
  const deleteLayer = () => {
    if (!map || !layersSelected) return;

    if (!layersSelected!.group) {
      // delete single layer
      if (map.getLayer(layersSelected.key)) {
        removeLayersChecked(layersSelected.key);
        removeLayersExpanded(layersSelected.key);
        deleteLayerBykey(layersSelected.key);
        map.removeLayer(layersSelected.key);
        map.removeSource(layersSelected.key);
      }
    } else {
      // delete layer group
      const layerKeys = getLayerKeys([layersSelected]);
      const groupKeys = getGroupKeys([layersSelected]);
      layerKeys!.forEach((key: string) => {
        removeLayersChecked(layersSelected.key);
        removeLayersExpanded(layersSelected.key);
        deleteLayerBykey(key);
        map.removeLayer(key);
        map.removeSource(key);
      });
      groupKeys!.forEach((key: string) => {
        removeLayersChecked(layersSelected.key);
        removeLayersExpanded(layersSelected.key);
        deleteLayerBykey(key);
      });
    }
  };

  /**
   * delete all layers
   */
  const deleteAllLayers = () => {
    const layerKeys = getLayerKeys(layers);
    const groupKeys = getGroupKeys(layers);
    if (!map) return;
    layerKeys!.forEach((key: string) => {
      removeLayersChecked(key);
      removeLayersExpanded(key);
      deleteLayerBykey(key);
      map.removeLayer(key);
      map.removeSource(key);
    });
    groupKeys!.forEach((key: string) => {
      removeLayersChecked(key);
      removeLayersExpanded(key);
      deleteLayerBykey(key);
    });
  };

  /**
   * rename layer by name
   * @param name name
   */
  const renameLayer = (name: string) => {
    if (!layersSelected) return;
    updateLayer(layersSelected.key, "title", name);
  };

  /**
   * create layer group
   */
  const createLayerGroup = () => {
    const key = crypto.randomUUID();
    const layerGroup: Layer = {
      title: "group",
      key: key,
      group: true,
      children: [],
    };

    addLayer(layerGroup);
    addLayersExpanded(key);
  };

  // store all funciton in hook
  const layerActions = {
    showAll: showAllLayers,
    expandAll: expandAllLayers,
    delete: deleteLayer,
    deleteAll: deleteAllLayers,
    rename: renameLayer,
    group: createLayerGroup,
  };

  return (layerActions as any)[action];
};

export default LayerPanel;
