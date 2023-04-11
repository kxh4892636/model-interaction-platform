/*
 * @File: LayerPanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-10
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
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
} from "../../components/layout";
import LayerTool from "./components/layer_tool";
import LayersTree from "./components/layer_tree/layer_tree";
import LayerTreeMenu from "./components/layer_tree_menu";
import { useLayerActions } from "./hooks/use_layer_actions";

/**
 * @description LayerPanel
 * @module LayerPanel
 * @author xiaohan kong
 * @export module: LayerPanel
 */
export const LayerPanel = () => {
  const layerActions = useLayerActions();

  const layerMenuItems = [
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
    </PanelContainer>
  );
};
