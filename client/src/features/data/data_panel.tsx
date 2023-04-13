/*
 * @File: data_panel.tsx
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import {
  FolderAddOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Button, Input, message } from "antd";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
} from "../../components/layout";
import { DataTools } from "./components/data_tools";
import { DataTree } from "./components/data_tree/data_tree";
import { DataTreeMenu } from "./components/data_tree_menu";
import { useDataActions } from "./hooks/use_data_actions";
import { useLayersStatusStore, useModalStore, useProjectStatusStore } from "../../stores";
import Modal from "antd/es/modal/Modal";
import Upload from "antd/es/upload/Upload";
import { useManualRefreshStore } from "../../stores/refresh_store";
import { useData } from "../../hooks";

/**
 * @description UploadPanel component
 * @module UploadPanel
 * @author xiaohan kong
 * @export module: UploadPanel
 */
const UploadPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const modalTag = useModalStore((state) => state.modalTag);
  const setModalTag = useModalStore((state) => state.setModalTag);
  const setModal = useModalStore((state) => state.setModal);
  const layerKey = useLayersStatusStore((state) => state.layersSelected);
  const manualRefresh = useManualRefreshStore((state) => state.manualRefresh);

  return (
    <Modal
      title="数据上传面板"
      okText="确认"
      centered
      style={{ top: "-10vh" }}
      confirmLoading={isLoading}
      open={modalTag}
      onCancel={() => {
        manualRefresh();
        setModalTag(false);
        setIsLoading(false);
        setModal(<></>);
      }}
      footer={null}
    >
      <Upload
        name="file"
        headers={{ authorization: "authorization-text" }}
        action={"http://localhost:3456/api/data/upload"}
        data={{ datasetID: layerKey["data"]!.key }}
        method="post"
        multiple
      >
        <Button icon={<UploadOutlined />}>上传文件</Button>
      </Upload>
    </Modal>
  );
};

/**
 * @description ReanmeInput component, pop up it after clicking rename in layerMenu
 * @Author xiaohan kong
 */
const RenameInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dataActions = useDataActions();
  const modalTag = useModalStore((state) => state.modalTag);
  const setModalTag = useModalStore((state) => state.setModalTag);
  const setModal = useModalStore((state) => state.setModal);
  const layerKey = useLayersStatusStore((state) => state.layersSelected);

  return (
    <Modal
      title="重命名面板"
      cancelText="取消"
      okText="确认"
      centered
      style={{ top: "-10vh" }}
      confirmLoading={isLoading}
      open={modalTag}
      onOk={async () => {
        await dataActions.renameLayer(inputValue, layerKey["data"]!.key);
        message.success("重命名成功");
        setModalTag(false);
        setIsLoading(false);
        setModal(<></>);
      }}
      onCancel={() => {
        message.error("重命名失败");
        setModalTag(false);
        setIsLoading(false);
        setModal(<></>);
      }}
    >
      <Input
        style={{
          width: "320px",
          marginBlockEnd: "10px",
        }}
        placeholder="请输入重命名后的名称"
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </Modal>
  );
};

/**
 * @description create the layer group, define it's title
 * @Author xiaohan kong
 */
const LayerGroupInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dataActions = useDataActions();
  const modalTag = useModalStore((state) => state.modalTag);
  const setModalTag = useModalStore((state) => state.setModalTag);
  const setModal = useModalStore((state) => state.setModal);
  const projectKey = useProjectStatusStore((state) => state.key);

  return (
    <Modal
      title="数据文件夹面板"
      cancelText="取消"
      okText="确认"
      centered
      style={{ top: "-10vh" }}
      confirmLoading={isLoading}
      open={modalTag}
      onOk={async () => {
        await dataActions.createLayerGroup(inputValue, projectKey);
        message.success("创建数据文件夹成功");
        setModalTag(false);
        setIsLoading(false);
        setModal(<></>);
      }}
      onCancel={() => {
        message.error("创建数据文件夹失败");
        setModalTag(false);
        setIsLoading(false);
        setModal(<></>);
      }}
    >
      <Input
        style={{
          width: "320px",
          marginBlockEnd: "10px",
        }}
        placeholder="输入数据文件夹名称"
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </Modal>
  );
};

/**
 * @description DataPanel
 * @module DataPanel
 * @author xiaohan kong
 * @export module: DataPanel
 */
export const DataPanel = () => {
  const setModalTag = useModalStore((state) => state.setModalTag);
  const setModal = useModalStore((state) => state.setModal);
  const dataActions = useDataActions();
  const layersSelected = useLayersStatusStore((state) => state.layersSelected);
  const data = useData();
  const layerMenuItems = () => {
    if (!layersSelected.data) return [];
    else;
    if (layersSelected.data.group) {
      return [
        {
          key: "upload",
          label: "上传至该文件夹",
          action: () => {
            setModalTag(true);
            setModal(<UploadPanel />);
          },
        },
        {
          key: "rename",
          label: "重命名该文件夹",
          action: () => {
            setModalTag(true);
            setModal(<RenameInput />);
          },
        },
        {
          key: "delete",
          label: "删除该文件夹",
          action: dataActions.deleteLayer,
        },
      ];
    } else;
    if (layersSelected.data.type === "text" || layersSelected.data!.layerStyle === "text") {
      return [
        {
          key: "rename",
          label: "重命名该文件",
          action: () => {
            setModalTag(true);
            setModal(<RenameInput />);
          },
        },
        {
          key: "delete",
          label: "删除该文件",
          action: dataActions.deleteLayer,
        },
      ];
    } else;
    return [
      {
        key: "add",
        label: "添加至地图",
        action: () => {
          data.addDataToMap(layersSelected.data!.key);
          data.addDataToLayerTree(layersSelected.data!.key);
        },
      },
      {
        key: "rename",
        label: "重命名该文件",
        action: () => {
          setModalTag(true);
          setModal(<RenameInput />);
        },
      },
      {
        key: "delete",
        label: "删除该文件",
        action: dataActions.deleteLayer,
      },
    ];
  };

  return (
    <PanelContainer>
      <PanelTitleContainer>数据面板</PanelTitleContainer>
      <PanelToolsContainer>
        <DataTools
          title={"创建数据文件夹"}
          icon={<FolderAddOutlined />}
          action={() => {
            setModalTag(true);
            setModal(<LayerGroupInput />);
          }}
        />
        <DataTools
          title={"展开所有文件夹"}
          icon={<VerticalAlignBottomOutlined />}
          action={() => {
            dataActions.expandAllLayers(true);
          }}
        />
        <DataTools
          title={"折叠所有文件夹"}
          icon={<VerticalAlignTopOutlined />}
          action={() => {
            dataActions.expandAllLayers(false);
          }}
        />
      </PanelToolsContainer>
      <PanelContentContainer>
        <DataTree>
          <DataTreeMenu layerMenuItems={layerMenuItems()} />
        </DataTree>
      </PanelContentContainer>
    </PanelContainer>
  );
};
