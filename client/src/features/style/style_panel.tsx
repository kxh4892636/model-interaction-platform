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
import { useState, useEffect } from "react";
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
  const getSlideValue = useSliderValue();
  const [sliderValue, setSliderValue] = useState<[number, number]>(getSlideValue(layerSelected));
  const getAnimatedStatus = useAnimatedStatusStore((state) => state.getAnimatedStatus);
  const updateAnimatedStatus = useAnimatedStatusStore((state) => state.updateAnimatedStatus);
  const animateActions = useAnimate();
  const map = useMapStore((state) => state.map);
  const dataActions = useData();

  useEffect(() => {
    // Update the value of slide when the value of selected is changed
    if (!layerSelected) return;
    else;
    const layer = getLayer(layerSelected!.key);
    if (layer) {
      if (layer.type !== "uvet") return;
      else;
      const range = getSlideRange(layer);
      setRange(range);
      setSliderValue(getSlideValue(layer));
    } else;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerSelected]);

  return (
    <PanelContainer>
      <PanelTitleContainer>样式面板</PanelTitleContainer>
      <PanelContentContainer>
        <>
          <div style={{ padding: "10px 12px" }}>选择图层</div>
          <Select
            defaultValue={
              layerSelected ? (layerSelected.group ? undefined : layerSelected.title) : undefined
            }
            value={
              layerSelected ? (layerSelected.group ? undefined : layerSelected.title) : undefined
            }
            style={{ margin: "6px 12px" }}
            onChange={(key) => {
              // Update layerSelected when the value of selected is changed
              const layer = getLayer(key);
              setLayersSelected(layer);
            }}
            options={selectOptions}
          />
        </>
        {layerSelected?.type === "uvet" ? (
          <>
            <div style={{ padding: "10px 12px" }}>时间范围</div>
            <Slider
              range
              min={range[0]}
              max={range[1]}
              step={1}
              defaultValue={sliderValue}
              value={sliderValue}
              tooltip={{ open: true, placement: "bottom" }}
              style={{ margin: "6px 18px" }}
              onChange={(value) => {
                // Update the value of slider
                setSliderValue(value);
              }}
            />
          </>
        ) : (
          <></>
        )}
      </PanelContentContainer>
      <PanelToolsContainer>
        <PanelToolContainer>
          <Button type="primary" danger style={{ marginBottom: "10px" }}>
            取消
          </Button>
        </PanelToolContainer>
        <PanelToolContainer>
          <Button
            type="primary"
            onClick={() => {
              console.log(layerSelected);
            }}
            style={{ marginBottom: "10px" }}
          >
            应用
          </Button>
        </PanelToolContainer>
        <PanelToolContainer>
          <Button
            type="primary"
            style={{ marginBottom: "10px" }}
            onClick={() => {
              // Update the animatedStatus of selected layer
              const style = layerSelected!.layerStyle;
              const startValue = sliderValue[0] - 1;
              const endValue = sliderValue[1] - 1;
              const key = layerSelected!.key;
              const currentCount = getAnimatedStatus(key)!.currentCount;
              const currentCountNow =
                (currentCount < endValue && currentCount > startValue
                  ? currentCount
                  : currentCount < startValue
                  ? startValue
                  : endValue) - 1;
              if (style === "raster") {
                animateActions.pauseAnimate(key);
                updateAnimatedStatus(key, "startValue", startValue);
                updateAnimatedStatus(key, "endValue", endValue);
                updateAnimatedStatus(key, "currentCount", currentCountNow);
                animateActions.continueAnimate(key, currentCountNow, startValue, endValue);
              } else if (style === "flow") {
                // Re-render the flow field
                updateAnimatedStatus(key, "startValue", startValue);
                updateAnimatedStatus(key, "endValue", endValue);
                updateAnimatedStatus(key, "currentCount", currentCountNow);
                dataActions.getDataDetail(key).then((res) => {
                  let flowFieldManager = new FlowFieldManager(key, res, {
                    startValue: startValue,
                    endValue: endValue,
                  });
                  // Hide layer if it isn't showed
                  if (map!.getLayoutProperty(key, "visibility") === "none") {
                    map!.removeLayer(key);
                    const flowLayer = new FlowLayer(key, "2d", flowFieldManager);
                    map!.addLayer(flowLayer);
                    map!.setLayoutProperty(key, "visibility", "none");
                  } else {
                    map!.removeLayer(key);
                    const flowLayer = new FlowLayer(key, "2d", flowFieldManager);
                    map!.addLayer(flowLayer);
                    map!.setLayoutProperty(key, "visibility", "visible");
                  }
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

/**
 * Create the options of Select
 * @param layers All layer of layer tree
 * @returns selectOptions
 */
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

/**
 * Get the current range of slider based on the animatedStatus of selected layer
 * @returns [min, max]
 */
const useSliderValue = () => {
  const getAnimatedStatus = useLayersAnimatedStore((state) => state.getAnimatedStatus);
  const getSliderValue = (layerSelected: Layer | undefined): [number, number] => {
    if (!layerSelected) return [1, 100];
    else;
    const key = layerSelected.key;
    const animatedStatus = getAnimatedStatus(key);

    if (animatedStatus) return [animatedStatus.startValue + 1, animatedStatus.endValue + 1];
    else return [1, 100];
  };

  return getSliderValue;
};

/**
 * Get the initial range of slider based on  the animatedStatus of selected layer
 * @returns [min, max]
 */
const useSliderRange = () => {
  const getAnimatedStatus = useLayersAnimatedStore((state) => state.getAnimatedStatus);
  const getSliderRange = (layerSelected: Layer | undefined): [number, number] => {
    if (!layerSelected) return [1, 100];
    else;
    const key = layerSelected.key;
    const animatedStatus = getAnimatedStatus(key);
    if (animatedStatus) return [1, animatedStatus.imageCount];
    else return [1, 100];
  };

  return getSliderRange;
};
