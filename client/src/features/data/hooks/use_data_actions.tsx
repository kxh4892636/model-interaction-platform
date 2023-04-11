/*
 * @File: data action hook
 * @Author: xiaohan kong
 * @Date: 2023-03-04
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { useLayersStore } from "../../../stores/layers_store";
import { useLayersStatusStore } from "../../../stores/layers_status_store";
import { useKeys } from "../../../hooks";
import { Layer } from "../../../types";
import axios from "axios";

/**
 * @description DataPanel action
 * @autor xiaohan kong
 */
export const useDataActions = () => {
  const layers = useLayersStore((state) => state.layers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const deleteLayerByKey = useLayersStore((state) => state.deleteLayer);
  const updateLayer = useLayersStore((state) => state.updateLayer);
  const getKeys = useKeys();
  const setLayersExpanded = useLayersStatusStore((state) => state.setLayersExpanded);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);
  const deleteLayersChecked = useLayersStatusStore((state) => state.deleteLayersChecked);
  const deleteLayersExpanded = useLayersStatusStore((state) => state.deleteLayersExpanded);
  const layersSelected = useLayersStatusStore((state) => state.layersSelected);
  const setLayersSelected = useLayersStatusStore((state) => state.setLayersSelected);

  /**
   * expand or collapse all layers by expand
   * @param expand true: expand; false: collapse
   */
  const expandAllLayers = (expand: boolean) => {
    const groupKeys = getKeys.getGroupKeys(layers["data"]);
    if (expand) {
      setLayersExpanded(groupKeys, "data");
    } else {
      setLayersExpanded([], "data");
    }
  };

  /**
   * delete layer that is selected now
   */
  const deleteLayer = () => {
    if (!layersSelected["data"]) return;
    else;
    if (!layersSelected["data"].group) {
      // delete single layer
      axios.request({
        url: "http://localhost:3456/api/data/action",
        method: "post",
        data: {
          action: "delete",
          dataID: layersSelected["data"].key,
        },
      });
      deleteLayersChecked(layersSelected["data"].key, "data");
      deleteLayersExpanded(layersSelected["data"].key, "data");
      deleteLayerByKey(layersSelected["data"].key, "data");
      setLayersSelected(undefined, "data");
    } else {
      // delete layer group
      axios.request({
        url: "http://localhost:3456/api/dataset/action",
        method: "post",
        data: {
          action: "delete",
          datasetID: layersSelected["data"].key,
        },
      });
      const layerKeys = getKeys.getLayerKeys([layersSelected["data"]]);
      const groupKeys = getKeys.getGroupKeys([layersSelected["data"]]);
      layerKeys!.forEach((key: string) => {
        deleteLayersChecked(key, "data");
        deleteLayersExpanded(key, "data");
        deleteLayerByKey(key, "data");
        setLayersSelected(undefined, "data");
      });
      groupKeys!.forEach((key: string) => {
        deleteLayersChecked(key, "data");
        deleteLayersExpanded(key, "data");
        deleteLayerByKey(key, "data");
      });
      setLayersSelected(undefined, "data");
    }
  };

  /**
   * rename layer by name
   * @param name name
   */
  const renameLayer = async (title: string, layerKey: string) => {
    if (!layersSelected["data"]) return;
    else {
      updateLayer(layersSelected["data"].key, "data", "title", title);
      if (layersSelected["data"].group) {
        axios.request({
          url: "http://localhost:3456/api/dataset/action",
          method: "post",
          data: {
            action: "rename",
            title: title,
            datasetID: layerKey,
          },
        });
      } else {
        axios.request({
          url: "http://localhost:3456/api/data/action",
          method: "post",
          data: {
            action: "rename",
            title: title,
            dataID: layerKey,
          },
        });
      }
    }
  };

  /**
   * create layer group
   */
  const createLayerGroup = async (title: string = "group", projectKey: string) => {
    const result = await axios.request({
      url: "http://localhost:3456/api/dataset/action",
      method: "post",
      data: {
        action: "create",
        title: title,
        projectKey: projectKey,
      },
    });
    const key = result.data.content;
    const layerGroup: Layer = {
      title: title,
      key: key,
      type: "text",
      layerStyle: "text",
      group: true,
      children: [],
    };
    addLayer(layerGroup, "data");
    addLayersExpanded(key, "data");
  };

  return {
    deleteLayer,
    renameLayer,
    createLayerGroup,
    expandAllLayers,
  };
};
