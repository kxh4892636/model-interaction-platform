/*
 * @File: layer action hook
 * @Author: xiaohan kong
 * @Date: 2023-03-04
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-04
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import useMapStore from "../../../stores/map_store";
import useLayersStore from "../../../stores/layers_store";
import useLayersStatusStore from "../../../stores/layers_status_store";
import { useAnimate, useKeys } from "../../../hooks";
import { Layer } from "../../../types";

/**
 * @description LayerPanel action
 * @autor xiaohan kong
 * @param action return function corresponding to the action
 */
const useLayerActions = () => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const setLayers = useLayersStore((state) => state.setLayers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const deleteLayerByKey = useLayersStore((state) => state.deleteLayer);
  const updateLayer = useLayersStore((state) => state.updateLayer);
  const getKeys = useKeys();
  const setLayersChecked = useLayersStatusStore((state) => state.setLayersChecked);
  const setLayersExpanded = useLayersStatusStore((state) => state.setLayersExpanded);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);
  const removeLayersChecked = useLayersStatusStore((state) => state.removeLayersChecked);
  const removeLayersExpanded = useLayersStatusStore((state) => state.removeLayersExpanded);
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
    const layerKeys = getKeys.getLayerKeys(layers);
    const allKeys = getKeys.getAllKeys(layers);

    setLayersChecked(show ? allKeys! : []);
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
    const data: Layer[] = JSON.parse(JSON.stringify(layers));
    // NOTE 限制 tree drag 行为的思路
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
    setLayers(data);
  };

  /**
   * expand or collapse all layers by expand
   * @param expand true: expand; false: collapse
   */
  const expandAllLayers = (expand: boolean) => {
    const groupKeys = getKeys.getGroupKeys(layers);
    if (expand) {
      setLayersExpanded(groupKeys);
    } else {
      setLayersExpanded([]);
    }
  };

  /**
   * delete layer that is selected now
   */
  const deleteLayer = () => {
    if (!map || !layersSelected) return;

    if (!layersSelected!.group) {
      removeLayersChecked(layersSelected.key);
      removeLayersExpanded(layersSelected.key);
      deleteLayerByKey(layersSelected.key);

      // delete single layer
      if (map.getLayer(layersSelected.key)) map.removeLayer(layersSelected.key);
      else;
      if (map.getSource(layersSelected.key)) map.removeSource(layersSelected.key);
      else;
      animate.removeAnimate(layersSelected.key);
      setLayersSelected(undefined);
    } else {
      // delete layer group
      const layerKeys = getKeys.getLayerKeys([layersSelected]);
      const groupKeys = getKeys.getGroupKeys([layersSelected]);
      layerKeys!.forEach((key: string) => {
        removeLayersChecked(key);
        removeLayersExpanded(key);
        deleteLayerByKey(key);
        if (map.getLayer(key)) map.removeLayer(key);
        else;
        if (map.getSource(key)) map.removeSource(key);
        else;
        animate.removeAnimate(key);
        setLayersSelected(undefined);
      });
      groupKeys!.forEach((key: string) => {
        removeLayersChecked(key);
        removeLayersExpanded(key);
        deleteLayerByKey(key);
      });
      setLayersSelected(undefined);
    }
  };

  /**
   * delete all layers
   */
  const deleteAllLayers = () => {
    const layerKeys = getKeys.getLayerKeys(layers);
    const groupKeys = getKeys.getGroupKeys(layers);
    if (!map) return;
    layerKeys!.forEach((key: string) => {
      removeLayersChecked(key);
      removeLayersExpanded(key);
      deleteLayerByKey(key);
      if (map.getLayer(key)) map.removeLayer(key);
      else;
      if (map.getSource(key)) map.removeSource(key);
      else;
      animate.removeAnimate(key);
    });
    groupKeys!.forEach((key: string) => {
      removeLayersChecked(key);
      removeLayersExpanded(key);
      deleteLayerByKey(key);
    });
    setLayersSelected(undefined);
  };

  /**
   * rename layer by name
   * @param name name
   */
  const renameLayer = (name: string) => {
    if (!layersSelected) return;
    updateLayer(layersSelected.key, "title", name);
  };

  /**
   * create layer group
   */
  const createLayerGroup = (title: string = "group") => {
    const key = crypto.randomUUID();
    const layerGroup: Layer = {
      title: title,
      key: key,
      type: "text",
      layerStyle: "text",
      group: true,
      children: [],
    };

    addLayer(layerGroup);
    addLayersExpanded(key);
  };

  return {
    showLayer,
    showAllLayers,
    dragLayer,
    deleteAllLayers,
    deleteLayer,
    renameLayer,
    createLayerGroup,
    expandAllLayers,
  };
};

export default useLayerActions;
