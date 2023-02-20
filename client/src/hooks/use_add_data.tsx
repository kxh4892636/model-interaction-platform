/*
 * @File: useAddData hook
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-20
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import axios from "axios";
import useMapStore from "../stores/map_store";
import useLayersStore from "../stores/layers_store";
import useLayersStatusStore from "../stores/layers_status_store";
import { useGetKeys } from ".";
import { Layer } from "../types";

/**
 * @description return the function that add data to map and layer panel
 * @autor xiaohankong
 */
const useAddData = () => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const addLayersChecked = useLayersStatusStore((state) => state.addLayersChecked);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);
  const getLayerKeys = useGetKeys("layer");

  /**
   * add data to map and layer panel
   * @param key data key
   * @param title data title
   */
  const addData = (key: string, title: string) => {
    const keys = getLayerKeys(layers);
    if (keys!.includes(key)) {
      return;
    } else {
      axios.get("http://localhost:3456/data/data?id=" + key).then((res) => {
        if (!map) return;

        const data: string = res.data;
        const treeData: Layer = {
          title: title,
          key: key,
          group: false,
          children: [],
        };
        addLayer(treeData);
        addLayersChecked(key);
        addLayersExpanded(key);

        map.addSource(key, {
          type: "geojson",
          data: data,
        });
        map.addLayer({
          id: key,
          type: "line",
          source: key,
          layout: {
            visibility: "visible",
          },
        });
      });
    }
  };

  return addData;
};

export default useAddData;
