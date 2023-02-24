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
  const getData = async (id: string) => {
    const data = await axios.get("http://localhost:3456/data/data?id=" + id).then((res) => {
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

        getData(id).then((res) => {
          addLayer(treeData);
          addLayersChecked(id);
          addLayersExpanded(id);

          const geomType = ["line", "fill"];

          if (geomType.includes(type)) {
            map.addSource(id, {
              type: "geojson",
              data: res,
            });
            map.addLayer({
              id: id,
              type: type as any,
              source: id,
              layout: {
                visibility: "visible",
              },
            });
          }
        });
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
