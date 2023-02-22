/*
 * @File: useData hook
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-22
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import axios from "axios";
import useMapStore from "../stores/map_store";
import useLayersStore from "../stores/layers_store";
import useLayersStatusStore from "../stores/layers_status_store";
import { useKeys } from ".";
import { Layer, ServerData } from "../types";

type Type = "get" | "add";

/**
 * @description return the function that curd data
 * @autor xiaohankong
 * @param type return the function according to type, now have get and add
 */
const useData = (type: Type) => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const addLayersChecked = useLayersStatusStore((state) => state.addLayersChecked);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);
  const getLayerKeys = useKeys("layer");

  /**
   * get data by url
   * @param url data url
   */
  const getData = (key: string) => {
    const layerKeys = getLayerKeys(layers);
    const urlData = "http://localhost:3456/data/data?id=" + key;
    let data;

    if (layerKeys!.includes(key)) {
      return;
    } else {
      axios.get(urlData).then((res) => {
        console.log("res", res.data);
        data = res.data;
      });
    }
    return data;
  };

  /**
   * add data by url
   * @param url data url
   */
  const addData = (key: string) => {
    if (!map) return;

    const urlData = "http://localhost:3456/data/data?id=" + key;
    const urlDetail = "http://localhost:3456/data/detail?id=" + key;
    axios.get(urlDetail).then((res) => {
      const dataDetail: ServerData = res.data;
      const treeData: Layer = {
        title: dataDetail.title,
        key: key,
        group: false,
        children: [],
      };
      addLayer(treeData);
      addLayersChecked(key);
      addLayersExpanded(key);

      axios.get(urlData).then((res) => {
        const data = res.data;

        map.addSource(key, {
          type: "geojson",
          data: data as any,
        });
        map.addLayer({
          id: key,
          type: dataDetail.type as any,
          source: key,
          layout: {
            visibility: "visible",
          },
        });
      });
    });
  };

  if (type === "get") {
    return getData;
  } else {
    return addData;
  }
};

export default useData;
