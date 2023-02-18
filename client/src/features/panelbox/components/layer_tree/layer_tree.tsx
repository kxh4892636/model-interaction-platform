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
import useMapStore from "../../../../stores/map_store";
import useLayersStore from "../../../../stores/layers_store";
import useLayersStatusStore from "../../../../stores/layers_status_store";
import useGetKeys from "../../../../hooks/use_get_keys";
import { Layer } from "../../../../types";

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
  const showLayer = useLayerActions("show");
  const dragLayer = useLayerActions("drag");

  return (
    <StyledTree
      showIcon
      icon={children}
      checkable
      onCheck={(checkedKeys, info) => {
        // NOTE 用法
        // show or hide layer
        setLayersChecked(checkedKeys as string[]);
        showLayer(info);
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
        dragLayer(info);
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

// NOTE 语法
type Action = "show" | "drag";

/**
 * @description LayerPanel action
 * @autor xiaohan kong
 * @param action return function corresponding to action, have showLayer and dragLayer
 */

const useLayerActions = (action: Action) => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const setLayers = useLayersStore((state) => state.setLayers);
  const getLayerKeys = useGetKeys("layer");

  /**
   * show and hide layer
   * @param info suggest console.log(info)
   */
  const showLayer = (info: any) => {
    if (!map) return;
    if (!info.node.group) {
      // show and hide single layer
      map.setLayoutProperty(info.node.key, "visibility", info.checked ? "visible" : "none");
    } else {
      // show and hide layer group and it's son layer
      const keys = getLayerKeys(info.node);
      for (const key of keys!) {
        map.setLayoutProperty(key, "visibility", info.checked ? "visible" : "none");
      }
    }
  };

  /**
   * drag layer
   * @param info suggest console.log(info)
   */
  const dragLayer = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // NOTE study
    const loop = (
      data: Layer[],
      key: string,
      callback: (value: Layer, index: number, data: Layer[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    // deep copy layers
    const data: Layer[] = JSON.parse(JSON.stringify(layers));

    // if drop and drag layer are both layer group, the action is invalid
    if (info.dragNode.group) {
      const pos = info.node.pos.split("-");
      if (pos.length > 2) return;
    }

    // Find dragObject
    let dragObj: Layer;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    // if drop layer is layer group and drag layer is not, drag layer become its son layer
    if (!info.dropToGap && info.node.group && !info.dragNode.group) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      // NOTE Typescript variable used before being assigned  solution
      let ar: Layer[];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar!.splice(i!, 0, dragObj!);
      } else {
        ar!.splice(i! + 1, 0, dragObj!);
      }
    }
    setLayers(data);
  };

  if (action === "show") {
    return showLayer;
  } else if (action === "drag") {
    return dragLayer;
  } else {
    return () => {
      console.log("useLayerAction args error");
    };
  }
};

export default LayerTree;
