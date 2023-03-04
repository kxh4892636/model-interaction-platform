/*
 * @File: LayerTree component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components";
import { Tree } from "antd";
import useLayersStore from "../../../../stores/layers_store";
import useLayersStatusStore from "../../../../stores/layers_status_store";
import useLayerActions from "../../hooks/use_layer_actions";

// modify sytle of antd tree component
const StyledTree = styled(Tree)`
  && {
    padding: 10px 10px;
  }
  // antd tree icon's style
  // put the icon at the far right
  .ant-tree-node-content-wrapper {
    display: flex;
    flex-direction: row-reverse;
  }
  .ant-tree-node-content-wrapper .ant-tree-title {
    margin-right: auto;
  }
  // set icon size
  .ant-tree-node-content-wrapper .ant-tree-iconEle {
    font-size: 18px;
  }
  // set icon's hover status
  .ant-tree-node-content-wrapper .ant-tree-iconEle:hover {
    color: #4096ff;
  }
`;

type AppProps = { children: JSX.Element };

/**
 * @description LayerTree component
 * @module LayerTree
 * @Author xiaohan kong
 * @param menu LayerMenu component
 * @export module: LayerTree
 */
const LayerTree = ({ children }: AppProps) => {
  const layers = useLayersStore((state) => state.layers);
  const layersChecked = useLayersStatusStore((state) => state.layersChecked);
  const layersExpanded = useLayersStatusStore((state) => state.layersExpanded);
  const setLayersChecked = useLayersStatusStore((state) => state.setLayersChecked);
  const setLayersExpanded = useLayersStatusStore((state) => state.setLayersExpanded);
  const setLayersSelected = useLayersStatusStore((state) => state.setLayersSelected);
  const layerActions = useLayerActions();

  return (
    <StyledTree
      showIcon
      icon={children}
      checkable
      onCheck={(checkedKeys, info) => {
        // show or hide layer
        setLayersChecked(checkedKeys as string[]);
        layerActions.showLayer(info);
      }}
      checkedKeys={layersChecked}
      onExpand={(expandedKeys) => {
        // expand or collapse layer
        setLayersExpanded(expandedKeys as string[]);
      }}
      expandedKeys={layersExpanded}
      draggable
      blockNode
      onDrop={(info) => {
        // drag Layer
        layerActions.dragLayer(info);
      }}
      onSelect={(key, e) => {
        // get selected layer node data
        if (e.selected) {
          setLayersSelected(e.node as any);
        }
      }}
      treeData={layers}
    />
  );
};

export default LayerTree;
