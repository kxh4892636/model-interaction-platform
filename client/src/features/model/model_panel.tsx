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
import { useEffect, useState } from "react";
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
  const addModelStatus = useModelsStatus((state) => state.addModelStatus);
  const getModelStatus = useModelsStatus((state) => state.getModelStatus);
  const updateModelStatus = useModelsStatus((state) => state.updateModelStatus);
  const currentModelStatus = getModelStatus(model);

  useEffect(() => {
    if (getModelStatus(model)) return;
    addModelStatus({
      boundaryKey: null,
      intervalStore: null,
      isRunning: false,
      model: model,
      paramKeys: [],
      percent: 0,
      projKey: null,
      resultKeys: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                currentModelStatus?.intervalStore &&
                  clearInterval(currentModelStatus.intervalStore);
                const percentInterval = setInterval(async () => {
                  const dataInfo = await dataActions.getDataDetail(keys[0]);
                  const progress = dataInfo.progress;
                  updateModelStatus(
                    model,
                    "percent",
                    Number(((progress[0] / progress[1]) * 100).toFixed(2))
                  );
                  if (progress[0] === progress[1] && progress[1]) {
                    clearInterval(percentInterval);
                    updateModelStatus(model, "isRunning", false);
                    keys.forEach((key) => {
                      dataActions.addDataToLayerTree(key);
                      dataActions.addDataToMap(key);
                    });
                    message.success("模型运行完毕", 10);
                  }
                }, 2000);
                updateModelStatus(model, "intervalStore", percentInterval);
              };
              if (currentModelStatus?.isRunning) {
                getPercent(currentModelStatus.resultKeys!);
              } else {
                axios({
                  method: "post",
                  baseURL: "http://localhost:3456/model/Hydrodynamic",
                  data: [
                    currentModelStatus!.paramKeys,
                    currentModelStatus!.projKey,
                    currentModelStatus!.boundaryKey,
                  ],
                }).then((response) => {
                  if (response.data.status === "success") {
                    updateModelStatus(model, "resultKeys", response.data.content);
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
          <Button
            onClick={() => {
              console.log(currentModelStatus);
              console.log(currentModelStatus?.paramKeys);
            }}
          >
            kkk
          </Button>
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
