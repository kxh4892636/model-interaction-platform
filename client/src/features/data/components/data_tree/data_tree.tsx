/*
 * @File: data_tree.tsx
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components/macro";
import { Tree } from "antd";
import { useLayersStore, useProjectStatusStore } from "../../../../stores";
import { useLayersStatusStore } from "../../../../stores";
import { useEffect } from "react";
import axios from "axios";
import { useManualRefreshStore } from "../../../../stores/refresh_store";
import { serverHost } from "../../../../config/global_variable";

const { DirectoryTree } = Tree;

// modify sytle of antd tree component
const StyledTree = styled(DirectoryTree)`
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

/**
 * @description DataTree component
 * @module DataTree
 * @Author xiaohan kong
 * @param menu DataMenu component
 * @export module: DataTree
 */
type DataTreeProps = { children: JSX.Element };
export const DataTree = ({ children }: DataTreeProps) => {
  const layers = useLayersStore((state) => state.layers);
  const setLayers = useLayersStore((state) => state.setLayers);
  const layersExpanded = useLayersStatusStore((state) => state.layersExpanded);
  const setLayersExpanded = useLayersStatusStore((state) => state.setLayersExpanded);
  const setLayersSelected = useLayersStatusStore((state) => state.setLayersSelected);
  const projectKey = useProjectStatusStore((state) => state.key);
  const refreshTag = useManualRefreshStore((state) => state.refreshTag);

  useEffect(() => {
    axios
      .request({
        url: serverHost + "/api/project/project",
        params: {
          action: "layer",
          id: projectKey,
        },
      })
      .then((res) => setLayers(res.data.content, "data"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTag]);

  return (
    <StyledTree
      showIcon
      icon={children}
      onExpand={(expandedKeys, info) => {
        if (info.nativeEvent.clientX <= 150) {
          // expand or collapse layer
          setLayersExpanded(expandedKeys as string[], "data");
        }
      }}
      expandedKeys={layersExpanded["data"]}
      blockNode
      onSelect={(key, e) => {
        // get selected layer node data
        if (e.selected) {
          setLayersSelected(e.node as any, "data");
        }
      }}
      treeData={layers["data"]}
    />
  );
};
