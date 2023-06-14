/*
 * @File: data_panel.tsx
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-06-06
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
import { Button, Input, Select, message } from "antd";
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
import {
  useLayersStatusStore,
  useLayersStore,
  useModalStore,
  useProjectStatusStore,
} from "../../stores";
import Modal from "antd/es/modal/Modal";
import Upload from "antd/es/upload/Upload";
import { useManualRefreshStore } from "../../stores/refresh_store";
import { useData } from "../../hooks";
import { serverHost } from "../../config/global_variable";
import { Layer } from "../../types";

/**
 * generate the select options of all mesh
 * @param layers layers
 * @returns select option
 */
const createSelectOptions = (layers: Layer[]) => {
  interface optionType {
    label: string;
    options: { value: string; label: string }[];
  }
  let selectOptions: optionType[] = [];
  for (let index = 0; index < layers.length; index++) {
    const layer = layers[index];
    selectOptions.push({ label: layer.title, options: [] });
    layer.children.forEach((layer) => {
      if (layer.type === "mesh") {
        selectOptions[index].options.push({
          label: layer.title,
          value: layer.key,
        });
      } else;
    });
  }
  const result = selectOptions.filter((value) => value.options.length !== 0);
  return result;
};

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
        action={serverHost + "/api/data/upload"}
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
const RenameInput = ({ defaultValue }: { defaultValue: string }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dataActions = useDataActions();
  const modalTag = useModalStore((state) => state.modalTag);
  const setModalTag = useModalStore((state) => state.setModalTag);
  const setModal = useModalStore((state) => state.setModal);
  const layerKey = useLayersStatusStore((state) => state.layersSelected);
  const manualRefresh = useManualRefreshStore((state) => state.manualRefresh);

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
        manualRefresh();
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
        defaultValue={defaultValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </Modal>
  );
};

/**
 * @description Visualization component, visualize data and then add to map
 * @Author xiaohan kong
 */
const Visualization = () => {
  const [selectValue, setSelectValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalTag = useModalStore((state) => state.modalTag);
  const setModalTag = useModalStore((state) => state.setModalTag);
  const setModal = useModalStore((state) => state.setModal);
  const layers = useLayersStore((state) => state.layers);
  const options = createSelectOptions(layers.data);
  const layersSelected = useLayersStatusStore((state) => state.layersSelected);
  const data = useData();

  return (
    <Modal
      title="可视化面板"
      cancelText="取消"
      okText="确认"
      centered
      style={{ top: "-10vh" }}
      confirmLoading={isLoading}
      open={modalTag}
      okButtonProps={{ disabled: !selectValue }}
      onOk={async () => {
        if (selectValue) {
          message.success("开始可视化");
          const status = await data.visualizeData(
            layersSelected.data!.key,
            selectValue
          );
          if (status === "success") {
            message.success("可视化成功");
          } else {
            message.error("可视化失败");
          }

          data.addDataToMap(layersSelected.data!.key);
          data.addDataToLayerTree(layersSelected.data!.key);
        } else;
        setModalTag(false);
        setIsLoading(false);
        setModal(<></>);
      }}
      onCancel={() => {
        setModalTag(false);
        setIsLoading(false);
        setModal(<></>);
      }}
    >
      <Select
        style={{ margin: "6px 0px", width: "80%" }}
        placeholder="请选择对应的 mesh 文件"
        value={selectValue}
        onChange={(value) => {
          console.log(value);
          setSelectValue(value);
        }}
        options={options}
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
            setModal(<RenameInput defaultValue={layersSelected.data!.title} />);
          },
        },
        {
          key: "delete",
          label: "删除该文件夹",
          action: dataActions.deleteLayer,
        },
      ];
    } else;
    if (
      layersSelected.data.type === "text" ||
      layersSelected.data!.layerStyle === "text" ||
      layersSelected.data.type === "ewemodel"
    ) {
      return [
        {
          key: "rename",
          label: "重命名该文件",
          action: () => {
            setModalTag(true);
            setModal(<RenameInput defaultValue={layersSelected.data!.title} />);
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
        action: async () => {
          console.log(layersSelected);
          if (layersSelected.data!.type === "mesh") {
            const state = await data.isVisualized(layersSelected.data!.key);
            if (!state) {
              message.info("正在可视化中");
              const status = await data.visualizeData(layersSelected.data!.key);
              if (status === "success") {
                message.success("可视化成功");
              } else {
                message.error("可视化失败");
              }
            } else;
            data.addDataToMap(layersSelected.data!.key);
            data.addDataToLayerTree(layersSelected.data!.key);
          } else if (layersSelected.data!.type === "point") {
            const state = await data.isVisualized(layersSelected.data!.key);
            if (!state) {
              setModalTag(true);
              setModal(<Visualization />);
            } else {
              data.addDataToMap(layersSelected.data!.key);
              data.addDataToLayerTree(layersSelected.data!.key);
            }
          } else if (layersSelected.data!.type === "model") {
            data.addDataToMap(layersSelected.data!.key);
            data.addDataToLayerTree(layersSelected.data!.key);
          } else;
        },
      },
      {
        key: "rename",
        label: "重命名该文件",
        action: () => {
          setModalTag(true);
          setModal(<RenameInput defaultValue={layersSelected.data!.title} />);
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
      <PanelContentContainer style={{ overflow: "auto" }}>
        <DataTree>
          <DataTreeMenu layerMenuItems={layerMenuItems()} />
        </DataTree>
      </PanelContentContainer>
    </PanelContainer>
  );
};
