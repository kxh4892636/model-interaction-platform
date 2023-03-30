/*
 * @File: ModelPanel
 * @Author: xiaohan kong
 * @Date: 2023-03-24
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-24
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Button, Select, SelectProps, Progress, message } from "antd";
import { useEffect } from "react";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolContainer,
  PanelToolsContainer,
} from "../../components/layout";
import { useData } from "../../hooks";
import useLayersStore from "../../stores/layers_store";
import { Layer } from "../../types";
import axios from "axios";
import useModelsStatus from "./stores/models_status";

/**
 * @description ModelPanel
 * @module ModelPanel
 * @author xiaohan kong
 * @param info the info of ModelPanel
 * @export module: ModelPanel
 */
interface AppProps {
  title: string;
  model: string;
}
const ModelPanel = ({ title, model }: AppProps) => {
  const layers = useLayersStore((state) => state.layers);
  const options: SelectProps["options"] = createSelectOptions(layers);
  const dataActions = useData();
  const modelStatus = useModelsStatus((state) => state.modelStatus);
  const addModelStatus = useModelsStatus((state) => state.addModelStatus);
  const getModelStatus = useModelsStatus((state) => state.getModelStatus);
  const updateModelStatus = useModelsStatus((state) => state.updateModelStatus);
  const removeModelStatus = useModelsStatus((state) => state.removeModelStatus);
  const currentModelStatus = getModelStatus(model);

  useEffect(() => {
    if (getModelStatus(model)) return;
    console.log(modelStatus);
    addModelStatus({
      boundaryKey: null,
      intervalStore: null,
      isRunning: false,
      model: model,
      paramKeys: [],
      percent: 0,
      projKey: null,
      resultKeys: null,
      pid: null,
    });
  });

  return (
    <PanelContainer>
      <PanelTitleContainer>{title}</PanelTitleContainer>
      <PanelContentContainer>
        <>
          <div style={{ padding: "10px 12px" }}>模型参数</div>
          <Select
            mode="multiple"
            disabled={currentModelStatus?.isRunning}
            allowClear
            style={{ margin: "6px 12px" }}
            placeholder="请输入指定参数"
            value={currentModelStatus?.paramKeys}
            onChange={(values) => {
              updateModelStatus(model, "paramKeys", values);
              updateModelStatus(model, "percent", 0);
            }}
            options={options}
          />
        </>
        <>
          <div style={{ padding: "10px 12px" }}>投影文件(可选参数)</div>
          <Select
            allowClear
            disabled={currentModelStatus?.isRunning}
            style={{ margin: "6px 12px" }}
            placeholder="请输入投影文件"
            value={currentModelStatus?.projKey}
            onChange={(value) => {
              updateModelStatus(model, "projKey", value);
              updateModelStatus(model, "percent", 0);
            }}
            options={options}
          />
        </>
        <>
          <div style={{ padding: "10px 12px" }}>边界文件(可选参数)</div>
          <Select
            allowClear
            disabled={currentModelStatus?.isRunning}
            style={{ margin: "6px 12px" }}
            placeholder="请输入边界文件"
            value={currentModelStatus?.boundaryKey}
            onChange={(value) => {
              updateModelStatus(model, "boundaryKey", value);
              updateModelStatus(model, "percent", 0);
            }}
            options={options}
          />
        </>
        <>
          <div style={{ padding: "10px 12px" }}>模型运行进度</div>
          <Progress
            percent={currentModelStatus?.percent ? currentModelStatus.percent : 0}
            style={{ margin: "0px 12px", width: "300px" }}
          />
        </>
      </PanelContentContainer>
      <PanelToolsContainer>
        <PanelToolContainer>
          <Button
            type="primary"
            disabled={!(currentModelStatus?.paramKeys && currentModelStatus?.paramKeys?.length)}
            onClick={() => {
              updateModelStatus(model, "isRunning", !currentModelStatus?.isRunning);
              const getPercent = (keys: string[]) => {
                const percentInterval = setInterval(async () => {
                  const dataInfo = await dataActions.getDataDetail(keys[0]);
                  const progress = dataInfo.progress;
                  // stop model if failed to run model
                  if (progress.length === 1) {
                    clearInterval(percentInterval);
                    currentModelStatus && clearInterval(currentModelStatus.intervalStore!);
                    removeModelStatus(model);
                    message.error(progress[0]);
                    return;
                  } else;
                  // update progress of model
                  updateModelStatus(
                    model,
                    "percent",
                    ((Number(progress[0]) / Number(progress[1])) * 100).toFixed(2)
                  );
                  // add result if model is finished
                  if (progress[0] === progress[1] && progress[1]) {
                    clearInterval(percentInterval);
                    updateModelStatus(model, "isRunning", false);
                    keys.forEach((key) => {
                      dataActions.addDataToLayerTree(key);
                      dataActions.addDataToMap(key);
                    });
                    message.success("模型运行完毕", 10);
                    return;
                  } else;
                }, 10000);
                updateModelStatus(model, "intervalStore", percentInterval);
              };
              // stop the model
              if (currentModelStatus?.isRunning) {
                clearInterval(currentModelStatus.intervalStore!);
                removeModelStatus(model);
                axios({
                  method: "post",
                  baseURL: "http://localhost:3456/model/Hydrodynamic",
                  data: [
                    currentModelStatus!.paramKeys,
                    currentModelStatus!.projKey,
                    currentModelStatus!.boundaryKey,
                    currentModelStatus.pid,
                  ],
                }).then(() => {
                  message.error("模型停止运行", 10);
                });
              } // run the model
              else {
                axios({
                  method: "post",
                  baseURL: "http://localhost:3456/model/Hydrodynamic",
                  data: [
                    currentModelStatus!.paramKeys,
                    currentModelStatus!.projKey,
                    currentModelStatus!.boundaryKey,
                    undefined,
                  ],
                }).then((response) => {
                  if (response.data.status === "success") {
                    console.log(response);
                    updateModelStatus(model, "resultKeys", response.data.content);
                    updateModelStatus(model, "pid", response.data.pid);
                    updateModelStatus(model, "isRunning", true);
                    getPercent(response.data.content);
                    message.success("模型开始运行", 10);
                  } else {
                    message.error("模型输入参数错误", 10);
                    updateModelStatus(model, "isRunning", false);
                  }
                });
              }
            }}
            style={{ marginBottom: "10px", marginLeft: "auto", marginRight: "12px" }}
            danger={currentModelStatus?.isRunning}
          >
            {currentModelStatus?.isRunning ? "停止运行" : "开始运行"}
          </Button>
          {/* <Button
            onClick={() => {
              console.log(modelStatus);
              console.log(currentModelStatus);
            }}
          ></Button> */}
        </PanelToolContainer>
      </PanelToolsContainer>
    </PanelContainer>
  );
};

const createSelectOptions = (layers: Layer[]) => {
  let selectOption: { label: string; value: string }[] = [];
  const loop = (
    layers: Layer[],
    callback: (value: Layer, index?: number, data?: { label: string; value: string }[]) => void
  ) => {
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (layer.group) {
        loop(layer.children, callback);
      } else {
        callback(layer);
      }
    }
  };
  loop(layers, (layer) => {
    selectOption.push({ label: layer.title, value: layer.key });
  });
  return selectOption;
};

export default ModelPanel;
