/*
 * @File: layer action hook
 * @Author: xiaohan kong
 * @Date: 2023-03-04
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-04
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { useAnimate, useKeys } from "../../../hooks";
import { useLayersStatusStore } from "../../../stores/layers_status_store";
import { useLayersStore } from "../../../stores/layers_store";
import { useMapStore } from "../../../stores/map_store";
import { Layer } from "../../../types";

/**
 * @description LayerPanel action
 * @autor xiaohan kong
 * @param action return function corresponding to the action
 */
export const useLayerActions = () => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const setLayers = useLayersStore((state) => state.setLayers);
  const deleteLayerByKey = useLayersStore((state) => state.deleteLayer);
  const getKeys = useKeys();
  const setLayersChecked = useLayersStatusStore((state) => state.setLayersChecked);
  const setLayersExpanded = useLayersStatusStore((state) => state.setLayersExpanded);
  const deleteLayersChecked = useLayersStatusStore((state) => state.deleteLayersChecked);
  const deleteLayersExpanded = useLayersStatusStore((state) => state.deleteLayersExpanded);
  const layersSelected = useLayersStatusStore((state) => state.layersSelected);
  const setLayersSelected = useLayersStatusStore((state) => state.setLayersSelected);
  const animate = useAnimate();

  /**
   * show and hide layer
   * @param info suggest console.log(info)
   */
  const showLayer = (info: any) => {
    if (!map) return;
    if (!info.node.group) {
      // show and hide single layer
      if (map.getLayer(info.node.key)) {
        map.setLayoutProperty(info.node.key, "visibility", info.checked ? "visible" : "none");
        info.checked ? animate.continueAnimate(info.node.key) : animate.pauseAnimate(info.node.key);
      } else;
    } else {
      // show and hide layer group and it's son layer
      const layerKeys = getKeys.getLayerKeys([info.node]);
      for (const key of layerKeys!) {
        if (map.getLayer(key)) {
          map.setLayoutProperty(key, "visibility", info.checked ? "visible" : "none");
          info.checked ? animate.continueAnimate(key) : animate.pauseAnimate(key);
        } else;
      }
    }
  };

  /**
   * show or hide all layers by show
   * @param show true: show; false: hide
   */
  const showAllLayers = (show: boolean) => {
    const layerKeys = getKeys.getLayerKeys(layers.map);
    const allKeys = getKeys.getAllKeys(layers.map);

    setLayersChecked(show ? allKeys! : [], "map");
    for (const key of layerKeys!) {
      if (map!.getLayer(key)) {
        map!.setLayoutProperty(key, "visibility", show ? "visible" : "none");
        show ? animate.continueAnimate(key) : animate.pauseAnimate(key);
      } else;
    }
  };

  /**
   * drag layer
   * @param info suggest console.log(info)
   */
  const dragLayer = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: Layer[],
      key: string,
      callback: (value: Layer, index: number, data: Layer[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    // deep copy layers
    const data: Layer[] = JSON.parse(JSON.stringify(layers.map));
    // if drop and drag layer are both layer group, the action is invalid
    if (info.dragNode.group) {
      const pos = info.node.pos.split("-");
      if (pos.length > 2) return;
    }
    // Find dragObject
    let dragObj: Layer;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    // if drop layer is layer group and drag layer is not, drag layer become its son layer
    if (!info.dropToGap && info.node.group && !info.dragNode.group) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: Layer[];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar!.splice(i!, 0, dragObj!);
      } else {
        ar!.splice(i! + 1, 0, dragObj!);
      }
    }
    setLayers(data, "map");
  };

  /**
   * expand or collapse all layers by expand
   * @param expand true: expand; false: collapse
   */
  const expandAllLayers = (expand: boolean) => {
    const groupKeys = getKeys.getGroupKeys(layers.map);
    if (expand) {
      setLayersExpanded(groupKeys, "map");
    } else {
      setLayersExpanded([], "map");
    }
  };

  /**
   * delete layer that is selected now
   */
  const deleteLayer = () => {
    if (!map || !layersSelected.map) return;

    if (!layersSelected.map.group) {
      deleteLayersChecked(layersSelected.map.key, "map");
      deleteLayersExpanded(layersSelected.map.key, "map");
      deleteLayerByKey(layersSelected.map.key, "map");

      // delete single layer
      if (map.getLayer(layersSelected.map.key)) map.removeLayer(layersSelected.map.key);
      else;
      if (map.getSource(layersSelected.map.key)) map.removeSource(layersSelected.map.key);
      else;
      console.log(layersSelected.map.key);
      
      animate.removeAnimate(layersSelected.map.key);
      setLayersSelected(undefined, "map");
    } else {
      // delete layer group
      const layerKeys = getKeys.getLayerKeys([layersSelected.map]);
      const groupKeys = getKeys.getGroupKeys([layersSelected.map]);
      layerKeys!.forEach((key: string) => {
        deleteLayersChecked(key, "map");
        deleteLayersExpanded(key, "map");
        deleteLayerByKey(key, "map");
        if (map.getLayer(key)) map.removeLayer(key);
        else;
        if (map.getSource(key)) map.removeSource(key);
        else;
        animate.removeAnimate(key);
        setLayersSelected(undefined, "map");
      });
      groupKeys!.forEach((key: string) => {
        deleteLayersChecked(key, "map");
        deleteLayersExpanded(key, "map");
        deleteLayerByKey(key, "map");
      });
      setLayersSelected(undefined, "map");
    }
  };

  /**
   * delete all layers
   */
  const deleteAllLayers = () => {
    const layerKeys = getKeys.getLayerKeys(layers.map);
    const groupKeys = getKeys.getGroupKeys(layers.map);
    if (!map) return;
    layerKeys!.forEach((key: string) => {
      deleteLayersChecked(key, "map");
      deleteLayersExpanded(key, "map");
      deleteLayerByKey(key, "map");
      if (map.getLayer(key)) map.removeLayer(key);
      else;
      if (map.getSource(key)) map.removeSource(key);
      else;
      animate.removeAnimate(key);
    });
    groupKeys!.forEach((key: string) => {
      deleteLayersChecked(key, "map");
      deleteLayersExpanded(key, "map");
      deleteLayerByKey(key, "map");
    });
    setLayersSelected(undefined, "map");
  };

  return {
    showLayer,
    showAllLayers,
    dragLayer,
    deleteAllLayers,
    deleteLayer,
    expandAllLayers,
  };
};
