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
import { useEffect, useRef } from "react";
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

const createWaterSelectOptions = (layers: Layer[]) => {
  interface optionType {
    label: string;
    options: { value: string; label: string }[];
  }
  let selectOptions: optionType[] = [];
  for (let index = 0; index < layers.length; index++) {
    const layer = layers[index];
    selectOptions.push({ label: layer.title, options: [] });
    layer.children.forEach((layer) => {
      if (layer.layerStyle === "water") {
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
 * @description QualityModelPanel
 * @module QualityModelPanel
 * @author xiaohan kong
 * @param model the store of all model
 * @export module: QualityModelPanel
 */
interface QualityModelPanelProps {
  title: string;
  model: string;
}
export const QualityModelPanel = ({ model }: QualityModelPanelProps) => {
  const layers = useLayersStore((state) => state.layers);
  const options: SelectProps["options"] = createSelectOptions(layers.data);
  const waterOptions: SelectProps["options"] = createWaterSelectOptions(
    layers.data
  );
  const modelStatus = useModelsStatus((state) => state.modelStatus);
  const addModelStatus = useModelsStatus((state) => state.addModelStatus);
  const getModelStatus = useModelsStatus((state) => state.getModelStatus);
  const updateModelStatus = useModelsStatus((state) => state.updateModelStatus);
  const removeModelStatus = useModelsStatus((state) => state.removeModelStatus);
  const currentModelStatus = getModelStatus(model);
  const setIsSpinning = useProjectStatusStore((state) => state.setIsSpinning);
  const projectKey = useProjectStatusStore((state) => state.key);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const getPercent = (modelID: string) => {
    const percentInterval = setInterval(async () => {
      // get progress of model
      const result = await axios({
        method: "get",
        baseURL: serverHost + "/api/model/water",
        params: {
          action: "info",
          modelID: modelID,
        },
      });
      if (result.data.status === "fail") {
        axios({
          method: "get",
          baseURL: serverHost + "/api/model/water",
          params: {
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
      if (progress[0] === 0 && progress[1] === 1) {
      } else {
        updateModelStatus(
          model,
          "percent",
          (1 + (progress[0] / progress[1]) * 99).toFixed(2)
        );
      }
      // add result if model is finished
      if (!result.data.content.is_running) {
        clearInterval(percentInterval);
        removeModelStatus(model);
        message.success("模型运行完毕");
        return;
      } else;
    }, 5000);
    updateModelStatus(model, "intervalStore", percentInterval);
  };

  useEffect(() => {
    if (getModelStatus(model)) {
      updateModelStatus(model, "textAreaRef", textAreaRef.current);
      textAreaRef.current!.value = sessionStorage.getItem("quality") || "";
      return;
    }
    console.log(modelStatus);
    addModelStatus({
      intervalStore: null,
      isRunning: false,
      model: model,
      hydrodynamicsParamKeys: [],
      waterParamKey: null,
      qualityParamKeys: [],
      sandParamKeys: [],
      percent: 0,
      projKey: null,
      resultKeys: null,
      modelID: null,
      datasetKey: null,
      title: "",
      source: null,
      textAreaRef: null,
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
          <div style={{ padding: "10px 12px" }}>水动力模型输出结果</div>
          <Select
            disabled={currentModelStatus?.isRunning}
            allowClear
            style={{ margin: "6px 12px", width: "100%" }}
            placeholder="请选择模型结果"
            value={currentModelStatus?.waterParamKey}
            onChange={(values) => {
              updateModelStatus(model, "waterParamKey", values);
              updateModelStatus(model, "percent", 0);
            }}
            options={waterOptions}
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
          <textarea
            className="tteexxtt"
            ref={textAreaRef}
            disabled={!currentModelStatus?.isRunning}
            style={{
              height: "180px",
              margin: "10px 12px",
              width: "100%",
              border: "1px solid #262626",
              padding: "8px 6px",
              background: "#434343",
              color: "#f0f0f0",
              borderRadius: "4px",
            }}
            id={Date.now().toString()}
            readOnly
          ></textarea>
          <PanelToolsContainer style={{ border: "0px" }}>
            <PanelToolContainer>
              <Progress
                percent={
                  currentModelStatus?.percent ? currentModelStatus.percent : 0
                }
                style={{
                  minWidth: "15vw",
                  marginRight: "auto",
                  marginLeft: "12px",
                }}
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
                  updateModelStatus(
                    model,
                    "isRunning",
                    !currentModelStatus?.isRunning
                  );
                  // stop the model
                  if (currentModelStatus?.isRunning) {
                    clearInterval(currentModelStatus.intervalStore!);
                    updateModelStatus(model, "intervalStore", null);
                    updateModelStatus(model, "percent", 0);
                    updateModelStatus(model, "modelID", null);
                    updateModelStatus(model, "hydrodynamicsParamKeys", []);
                    updateModelStatus(model, "waterParamKey", null);
                    updateModelStatus(model, "sandParamKeys", []);
                    updateModelStatus(model, "qualityParamKeys", []);
                    updateModelStatus(model, "resultKeys", null);
                    updateModelStatus(model, "title", "");
                    currentModelStatus!.source!.close();
                    axios({
                      method: "get",
                      baseURL: serverHost + "/api/model/water",
                      params: {
                        action: "stop",
                        modelID: currentModelStatus.modelID,
                      },
                    }).then(() => {
                      message.error("模型停止运行", 10);
                    });
                    sessionStorage.clear();
                    currentModelStatus.textAreaRef!.value = "";
                  } // run the model
                  else {
                    const source = new EventSource(
                      serverHost +
                        "/api/model/water" +
                        "?action=quality" +
                        `&paramKeys=${[
                          ...currentModelStatus!.qualityParamKeys!,
                        ]}` +
                        `&waterKey=${currentModelStatus!.waterParamKey}` +
                        `&projKey=${currentModelStatus!.projKey}` +
                        `&title=${currentModelStatus!.title}` +
                        `&projectID=${projectKey}`
                    );
                    updateModelStatus(model, "source", source);
                    source.addEventListener(
                      "message",
                      (e) => {
                        const data = e.data as string;
                        const currentModelStatus = getModelStatus(model);
                        if (data.includes("success")) {
                          const data = JSON.parse(e.data);
                          updateModelStatus(
                            model,
                            "datasetKey",
                            data.content[0]
                          );
                          updateModelStatus(model, "modelID", data.content[1]);
                          updateModelStatus(
                            model,
                            "resultKeys",
                            data.content[2]
                          );
                          updateModelStatus(model, "isRunning", true);
                          getPercent(data.content[1]);
                          sessionStorage.setItem("quality", "");
                          message.success("模型开始运行");
                        } else if (data.includes("fail")) {
                          clearInterval(currentModelStatus!.intervalStore!);
                          message.error("模型输入参数错误");
                          source.close();
                          removeModelStatus(model);
                          sessionStorage.clear();
                          currentModelStatus!.textAreaRef!.value = "";
                        } else {
                          const output = sessionStorage.getItem("quality");
                          sessionStorage.setItem(
                            "quality",
                            output + data + "\n"
                          );
                          currentModelStatus!.textAreaRef!.value =
                            output + data + "\n";
                          currentModelStatus!.textAreaRef!.scrollTop =
                            currentModelStatus!.textAreaRef!.scrollHeight -
                            currentModelStatus!.textAreaRef!.clientHeight;
                          // setTextAreaValue(output + data + "\n");
                        }
                        if (data.includes("all finish")) {
                          source.close();
                          removeModelStatus(model);
                          sessionStorage.clear();
                          currentModelStatus!.textAreaRef!.value = "";
                        }
                      },
                      false
                    );
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
