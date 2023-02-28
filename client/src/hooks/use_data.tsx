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

type Type = "get" | "add" | "detail";

/**
 * @description return the function that curd data
 * @autor xiaohankong
 * @param type return the function according to type, now have get, add, detail
 */
const useData = (type: Type) => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const addLayersChecked = useLayersStatusStore((state) => state.addLayersChecked);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);
  const getLayerKeys = useKeys("layer");

  /**
   * get data by id
   * @param id data id
   */
  const getDataDetail = async (id: string): Promise<ServerData> => {
    const data = await axios.get("http://localhost:3456/data/detail?id=" + id).then((res) => {
      return res.data as ServerData;
    });
    return data;
  };
  /**
   * get data by id
   * @param id data id
   */
  const getData = async (id: string, type: string = "json") => {
    const data = await axios
      .get("http://localhost:3456/data/data?id=" + id, {
        responseType: type as any,
      })
      .then((res) => {
        return res.data;
      });
    return data;
  };

  /**
   * add data to map by id
   * @param id data id
   */
  const addData = (id: string) => {
    if (!map || getLayerKeys(layers)!.includes(id)) {
      return;
    } else {
      getDataDetail(id).then((res) => {
        const dataDetail: ServerData = res;
        const treeData: Layer = {
          title: dataDetail.title,
          key: id,
          group: false,
          children: [],
        };
        const type = dataDetail.type;
        const style = dataDetail.style;
        const extent = dataDetail.extent;
        addLayer(treeData);
        addLayersChecked(id);
        addLayersExpanded(id);

        if (type === "mesh" && dataDetail.transform) {
          getData(id, "blob").then((res) => {
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            map.addSource(id, {
              type: "image",
              url: url,
              coordinates: [
                [extent[0], extent[3]],
                [extent[1], extent[3]],
                [extent[1], extent[2]],
                [extent[0], extent[2]],
              ],
            });
            map.addLayer({
              id: id,
              type: "raster",
              source: id,
              paint: {
                "raster-fade-duration": 0,
              },
            });
          });
        }
        // if (type === "image" || type === "video") {
        //   const blob = new Blob([res]);
        //   const url = window.URL.createObjectURL(blob);
        //   map.addSource(id, {
        //     type: "image",
        //     url: url,
        //     coordinates: [
        //       [-80.425, 46.437],
        //       [-71.516, 46.437],
        //       [-71.516, 37.936],
        //       [-80.425, 37.936],
        //     ],
        //   });
        //   map.addLayer({
        //     id: id,
        //     type: "raster",
        //     source: id,
        //     paint: {
        //       "raster-fade-duration": 0,
        //     },
        //   });
        // }

        // if (type === "geojson") {
        //   map.addSource(id, {
        //     type: "geojson",
        //     data: res,
        //   });
        //   map.addLayer({
        //     id: id,
        //     type: style as any,
        //     source: id,
        //     layout: {
        //       visibility: "visible",
        //     },
        //   });
        // }
      });
    }
  };

  if (type === "get") {
    return getData;
  } else if (type === "detail") {
    return getDataDetail;
  } else {
    return addData;
  }
};

export default useData;
