/*
 * @File: ModelPanel
 * @Author: xiaohan kong
 * @Date: 2023-03-24
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-24
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Button, Select, SelectProps, Progress, message, Input } from "antd";
import { useEffect } from "react";
import {
  PanelContainer,
  PanelContentContainer,
  PanelToolContainer,
  PanelToolsContainer,
} from "../../../components/layout";
import { useData } from "../../../hooks";
import { useLayersStore } from "../../../stores/layers_store";
import { Layer } from "../../../types";
import axios from "axios";
import { useModelsStatus } from "../stores/models_status";
import { useProjectStatusStore } from "../../../stores/project_status_store";

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
      selectOptions[index].options.push({ label: layer.title, value: layer.key });
    });
  }

  return selectOptions;
};

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
export const Hydrodynamics = ({ model }: AppProps) => {
  const layers = useLayersStore((state) => state.layers);
  const options: SelectProps["options"] = createSelectOptions(layers.data);
  const dataActions = useData();
  const modelStatus = useModelsStatus((state) => state.modelStatus);
  const addModelStatus = useModelsStatus((state) => state.addModelStatus);
  const getModelStatus = useModelsStatus((state) => state.getModelStatus);
  const updateModelStatus = useModelsStatus((state) => state.updateModelStatus);
  const removeModelStatus = useModelsStatus((state) => state.removeModelStatus);
  const currentModelStatus = getModelStatus(model);
  const setIsSpinning = useProjectStatusStore((state) => state.setIsSpinning);
  const projectKey = useProjectStatusStore((state) => state.key);

  const getPercent = (key: string) => {
    const percentInterval = setInterval(async () => {
      const dataInfo = await dataActions.getDataDetail(key);
      if (!dataInfo) {
        clearInterval(percentInterval);
        // currentModelStatus && clearInterval(currentModelStatus.intervalStore!);
        removeModelStatus(model);
        message.error("模型运行错误");
        return;
      } else;
      const progress = dataInfo.progress;
      // stop model if failed to run model
      // update progress of model
      updateModelStatus(
        model,
        "percent",
        ((Number(progress[0]) / Number(progress[1])) * 100).toFixed(2)
      );
      // add result if model is finished
      if (progress[0] === progress[1] && progress[1]) {
        clearInterval(percentInterval);
        removeModelStatus(model);
        dataActions.addDataToLayerTree(key);
        dataActions.addDataToMap(key);
        message.success("模型运行完毕", 10);
        return;
      } else;
    }, 2000);
    updateModelStatus(model, "intervalStore", percentInterval);
  };

  useEffect(() => {
    if (getModelStatus(model)) return;
    console.log(modelStatus);
    addModelStatus({
      intervalStore: null,
      isRunning: false,
      model: model,
      paramKeys: [],
      percent: 0,
      projKey: null,
      resultKeys: null,
      pid: null,
      datasetKey: null,
      title: "",
    });
  });

  return (
    <PanelContainer style={{ maxWidth: "30vw" }}>
      <PanelContentContainer>
        <>
          <div style={{ padding: "10px 12px" }}>模型案例名称</div>
          <Input
            placeholder="请输入项目案例名称"
            allowClear
            disabled={currentModelStatus?.isRunning}
            style={{ margin: "6px 12px", width: "100%" }}
            onChange={(e) => {
              updateModelStatus(model, "title", e.target.value);
            }}
          />
        </>
        <>
          <div style={{ padding: "10px 12px" }}>模型参数</div>
          <Select
            mode="multiple"
            disabled={currentModelStatus?.isRunning}
            allowClear
            style={{ margin: "6px 12px", width: "100%" }}
            placeholder="请选择模型参数"
            value={currentModelStatus?.paramKeys}
            onChange={(values) => {
              updateModelStatus(model, "paramKeys", values);
              updateModelStatus(model, "percent", 0);
            }}
            options={options}
          />
        </>
        <>
          <div style={{ padding: "10px 12px" }}>投影文件(可选)</div>
          <Select
            allowClear
            disabled={currentModelStatus?.isRunning}
            style={{ margin: "6px 12px", width: "100%" }}
            placeholder="请选择投影文件(可选)"
            value={currentModelStatus?.projKey}
            onChange={(value) => {
              updateModelStatus(model, "projKey", value);
              updateModelStatus(model, "percent", 0);
            }}
            options={options}
          />
        </>
        <>
          <div style={{ padding: "10px 12px" }}>模型运行进度</div>
          <PanelToolsContainer style={{ border: "0px" }}>
            <PanelToolContainer>
              <Progress
                percent={currentModelStatus?.percent ? currentModelStatus.percent : 0}
                style={{ minWidth: "15vw", marginRight: "auto", marginLeft: "12px" }}
              />
            </PanelToolContainer>
            <PanelToolContainer>
              <Button
                type="primary"
                style={{ marginBottom: "10px", marginLeft: "auto" }}
                disabled={
                  !(
                    currentModelStatus?.paramKeys &&
                    currentModelStatus.paramKeys.length &&
                    currentModelStatus.title.length
                  )
                }
                onClick={() => {
                  setIsSpinning(true);
                  updateModelStatus(model, "isRunning", !currentModelStatus?.isRunning);
                  // stop the model
                  if (currentModelStatus?.isRunning) {
                    clearInterval(currentModelStatus.intervalStore!);
                    removeModelStatus(model);
                    axios({
                      method: "post",
                      baseURL: "http://localhost:3456/api/model/hydrodynamics",
                      data: {
                        action: "stop",
                        datasetID: "",
                        pid: "",
                      },
                    }).then(() => {
                      message.error("模型停止运行", 10);
                    });
                  } // run the model
                  else {
                    axios({
                      method: "post",
                      baseURL: "http://localhost:3456/api/model/hydrodynamics",
                      data: {
                        action: "run",
                        paramKeys: currentModelStatus!.paramKeys,
                        projKey: currentModelStatus!.projKey,
                        title: currentModelStatus!.title,
                        projectID: projectKey,
                      },
                    }).then((response) => {
                      if (response.data.status === "success") {
                        updateModelStatus(model, "datasetKey", response.data.content[0]);
                        updateModelStatus(model, "pid", response.data.content[1]);
                        updateModelStatus(model, "resultKeys", response.data.content[2]);
                        updateModelStatus(model, "isRunning", true);
                        getPercent(response.data.content[2][0]);
                        message.success("模型开始运行", 10);
                      } else {
                        message.error("模型输入参数错误", 10);
                        removeModelStatus(model);
                      }
                    });
                  }
                  setIsSpinning(false);
                }}
                danger={currentModelStatus?.isRunning}
              >
                {currentModelStatus?.isRunning ? "停止运行" : "开始运行"}
              </Button>
            </PanelToolContainer>
          </PanelToolsContainer>
        </>
      </PanelContentContainer>
    </PanelContainer>
  );
};
