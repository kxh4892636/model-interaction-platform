/*
 * @File: QualityModelPanel
 * @Author: xiaohan kong
 * @Date: 2023-04-12
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-12
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
import { useLayersStore } from "../../../stores/layers_store";
import { Layer } from "../../../types";
import axios from "axios";
import { useModelsStatus } from "../stores/models_status";
import { useProjectStatusStore } from "../../../stores/project_status_store";
import { serverHost } from "../../../config/global_variable";

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
      if (layer.input || layer.layerStyle === "water") {
        selectOptions[index].options.push({ label: layer.title, value: layer.key });
      } else;
    });
  }
  const result = selectOptions.filter((value) => value.options.length !== 0);
  return result;
};

/**
 * @description QualityModelPanel
 * @module QualityModelPanel
 * @author xiaohan kong
 * @param model the store of all model
 * @export module: QualityModelPanel
 */
interface QualityModelPanelProps {
  model: string;
}
export const QualityModelPanel = ({ model }: QualityModelPanelProps) => {
  const layers = useLayersStore((state) => state.layers);
  const options: SelectProps["options"] = createSelectOptions(layers.data);
  const modelStatus = useModelsStatus((state) => state.modelStatus);
  const addModelStatus = useModelsStatus((state) => state.addModelStatus);
  const getModelStatus = useModelsStatus((state) => state.getModelStatus);
  const updateModelStatus = useModelsStatus((state) => state.updateModelStatus);
  const removeModelStatus = useModelsStatus((state) => state.removeModelStatus);
  const currentModelStatus = getModelStatus(model);
  const setIsSpinning = useProjectStatusStore((state) => state.setIsSpinning);
  const projectKey = useProjectStatusStore((state) => state.key);

  const getPercent = (modelID: string) => {
    const percentInterval = setInterval(async () => {
      const result = await axios({
        method: "post",
        baseURL: serverHost + "/api/model/water",
        data: {
          action: "info",
          modelID: modelID,
        },
      });
      if (result.data.status === "fail") {
        axios({
          method: "post",
          baseURL: serverHost + "/api/model/water",
          data: {
            action: "stop",
            modelID: modelID,
          },
        }).then(() => {
          message.error("模型停止运行", 10);
          clearInterval(percentInterval);
          // currentModelStatus && clearInterval(currentModelStatus.intervalStore!);
          removeModelStatus(model);
          return;
        });
      } else;
      const progress = result.data.content.progress;
      // stop model if failed to run model
      // update progress of model
      updateModelStatus(model, "percent", ((progress[0] / progress[1]) * 100).toFixed(2));
      // add result if model is finished
      if (!result.data.content.is_running) {
        clearInterval(percentInterval);
        removeModelStatus(model);
        message.success("模型运行完毕", 10);
        return;
      } else;
    }, 10000);
    updateModelStatus(model, "intervalStore", percentInterval);
  };

  useEffect(() => {
    if (getModelStatus(model)) return;
    console.log(modelStatus);
    addModelStatus({
      intervalStore: null,
      isRunning: false,
      model: model,
      hydrodynamicsParamKeys: [],
      qualityParamKeys: [],
      sandParamKeys: [],
      percent: 0,
      projKey: null,
      resultKeys: null,
      modelID: null,
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
            value={currentModelStatus?.title}
            onChange={(e) => {
              updateModelStatus(model, "title", e.target.value);
            }}
          />
        </>
        <>
          <div style={{ padding: "10px 12px" }}>水动力模型参数</div>
          <Select
            mode="multiple"
            disabled={currentModelStatus?.isRunning}
            allowClear
            style={{ margin: "6px 12px", width: "100%" }}
            placeholder="请选择模型参数"
            value={currentModelStatus?.hydrodynamicsParamKeys}
            onChange={(values) => {
              updateModelStatus(model, "hydrodynamicsParamKeys", values);
              updateModelStatus(model, "percent", 0);
            }}
            options={options}
          />
        </>
        <>
          <div style={{ padding: "10px 12px" }}>水质模型参数</div>
          <Select
            mode="multiple"
            disabled={currentModelStatus?.isRunning}
            allowClear
            style={{ margin: "6px 12px", width: "100%" }}
            placeholder="请选择模型参数"
            value={currentModelStatus?.qualityParamKeys}
            onChange={(values) => {
              updateModelStatus(model, "qualityParamKeys", values);
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
                    currentModelStatus?.qualityParamKeys &&
                    currentModelStatus.qualityParamKeys.length &&
                    currentModelStatus.title.length
                  )
                }
                onClick={() => {
                  setIsSpinning(true);
                  updateModelStatus(model, "isRunning", !currentModelStatus?.isRunning);
                  // stop the model
                  if (currentModelStatus?.isRunning) {
                    clearInterval(currentModelStatus.intervalStore!);
                    updateModelStatus(model, "intervalStore", null);
                    updateModelStatus(model, "percent", 0);
                    updateModelStatus(model, "modelID", null);
                    updateModelStatus(model, "hydrodynamicsParamKeys", []);
                    updateModelStatus(model, "sandParamKeys", []);
                    updateModelStatus(model, "qualityParamKeys", []);
                    updateModelStatus(model, "resultKeys", null);
                    updateModelStatus(model, "title", null);
                    axios({
                      method: "post",
                      baseURL: serverHost + "/api/model/water",
                      data: {
                        action: "stop",
                        modelID: currentModelStatus.modelID,
                      },
                    }).then(() => {
                      message.error("模型停止运行", 10);
                    });
                  } // run the model
                  else {
                    axios({
                      method: "post",
                      baseURL: serverHost + "/api/model/water",
                      data: {
                        action: "quality",
                        paramKeys: [
                          ...currentModelStatus!.hydrodynamicsParamKeys!,
                          ...currentModelStatus!.qualityParamKeys!,
                        ],
                        projKey: currentModelStatus!.projKey,
                        title: currentModelStatus!.title,
                        projectID: projectKey,
                      },
                    }).then((response) => {
                      if (response.data.status === "success") {
                        updateModelStatus(model, "datasetKey", response.data.content[0]);
                        updateModelStatus(model, "modelID", response.data.content[1]);
                        updateModelStatus(model, "resultKeys", response.data.content[2]);
                        updateModelStatus(model, "isRunning", true);
                        getPercent(response.data.content[1]);
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
