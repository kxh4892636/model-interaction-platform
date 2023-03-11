/*
 * @File: StylePanel component
 * @Author: xiaohan kong
 * @Date: 2023-03-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-10
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { Button, Slider, Select } from "antd";
import { useState } from "react";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolContainer,
  PanelToolsContainer,
} from "../../components/layout";
import { useAnimate, useData } from "../../hooks";
import useAnimatedStatusStore from "../../stores/animated_status_store";
import useLayersAnimatedStore from "../../stores/animated_status_store";
import useLayersStatusStore from "../../stores/layers_status_store";
import useLayersStore from "../../stores/layers_store";
import useMapStore from "../../stores/map_store";
import { Layer } from "../../types";
import { FlowFieldManager } from "../../features/map/utils/customLayer/flowfield";
import { FlowLayer } from "../../features/map/utils/customLayer/flowLayer";

/**
 * @description StylePanel
 * @module StylePanel
 * @author xiaohan kong
 * @export module: StylePanel
 */
const StylePanel = () => {
  const layerSelected = useLayersStatusStore((state) => state.layersSelected);
  const setLayersSelected = useLayersStatusStore((state) => state.setLayersSelected);
  const getLayer = useLayersStore((state) => state.getLayer);
  const layers = useLayersStore((state) => state.layers);
  const selectOptions = createSelectOptions(layers);
  const getSlideRange = useSliderRange();
  const [range, setRange] = useState(getSlideRange(layerSelected));
  const [sliderValue, setSliderValue] = useState<[number, number]>([0, 100]);
  const getAnimatedStatus = useAnimatedStatusStore((state) => state.getAnimatedStatus);
  const updateAnimatedStatus = useAnimatedStatusStore((state) => state.updateAnimatedStatus);
  const animateActions = useAnimate();
  const map = useMapStore((state) => state.map);
  const dataActions = useData();

  return (
    <PanelContainer>
      <PanelTitleContainer>样式面板</PanelTitleContainer>
      <PanelContentContainer>
        <div style={{ padding: "10px 12px" }}>选择图层</div>
        <Select
          defaultValue={layerSelected ? layerSelected.title : undefined}
          style={{ margin: "6px 12px" }}
          onChange={(key) => {
            // TODO
            const layer = getLayer(key);
            if (layer) {
              setLayersSelected(layer);
              if (layer.type !== "uvet") return;
              else;
              const range = getSlideRange(layer);
              setRange(range);
              setSliderValue(range);
            }
          }}
          options={selectOptions}
        />
        <div style={{ padding: "10px 12px" }}>时间范围</div>
        <Slider
          range
          min={range[0]}
          max={range[1]}
          step={10}
          defaultValue={range}
          value={sliderValue}
          tooltip={{ open: true, placement: "bottom" }}
          style={{ margin: "6px 18px" }}
          onChange={(value) => {
            setSliderValue(value);
          }}
        />
      </PanelContentContainer>
      <PanelToolsContainer>
        <PanelToolContainer>
          <Button type="primary" danger>
            取消
          </Button>
        </PanelToolContainer>
        <PanelToolContainer>
          <Button type="primary">应用</Button>
        </PanelToolContainer>
        <PanelToolContainer>
          <Button
            type="primary"
            onClick={() => {
              const style = layerSelected!.layerStyle;
              const startValue = sliderValue[0];
              const endValue = sliderValue[1];
              const key = layerSelected!.key;
              const currentCount = getAnimatedStatus(key)!.currentCount;
              const currentCountNow =
                currentCount < endValue && currentCount > startValue
                  ? currentCount
                  : currentCount < startValue
                  ? startValue
                  : endValue;
              if (style === "raster") {
                animateActions.pauseAnimate(key);
                updateAnimatedStatus(key, "startValue", startValue);
                updateAnimatedStatus(key, "endValue", endValue);
                updateAnimatedStatus(key, "currentCount", currentCountNow);
                animateActions.continueAnimate(key, currentCountNow, startValue, endValue);
              } else if (style === "flow") {
                dataActions.getDataDetail(key).then((res) => {
                  map!.removeLayer(key);
                  let flowFieldManager = new FlowFieldManager(key, res, {
                    startValue: startValue,
                    endValue: endValue,
                  });
                  const flowLayer = new FlowLayer(key, "2d", flowFieldManager);
                  map!.addLayer(flowLayer);
                });
              } else;
            }}
          >
            确认
          </Button>
        </PanelToolContainer>
      </PanelToolsContainer>
    </PanelContainer>
  );
};

export default StylePanel;

// create the options of Select
const createSelectOptions = (layers: Layer[]) => {
  let selectOptions: object[] = [];
  const loop = (data: Layer[], callback: (value: Layer, index: number, data: Layer[]) => void) => {
    for (let index = 0; index < data.length; index++) {
      const layer = data[index];
      if (layer.children) loop(layer.children, callback);
      else;
      if (!layer.group) callback(layer, index, data);
      else;
    }
  };
  loop(layers, (layer) => {
    selectOptions.push({ value: layer.key, label: layer.title });
  });
  return selectOptions;
};

const useSliderRange = () => {
  const getAnimatedStatus = useLayersAnimatedStore((state) => state.getAnimatedStatus);
  const getSliderRange = (layerSelected: Layer | undefined): [number, number] => {
    if (!layerSelected) return [0, 99];
    else;
    const key = layerSelected.key;
    const animatedStatus = getAnimatedStatus(key);
    if (animatedStatus) return [0, animatedStatus.imageCount - 1];
    else return [0, 99];
  };

  return getSliderRange;
};
