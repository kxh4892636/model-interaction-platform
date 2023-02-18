/*
 * @File: useAddData hook
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import axios from "axios";
import useMapStore from "../stores/map_store";
import useLayersStore from "../stores/layers_store";
import useLayersStatusStore from "../stores/layers_status_store";
import { Layer } from "../types";

/**
 * @description add data to web
 * @autor xiaohankong
 * @param url data url
 */
const useAddData = (url: string = "") => {
  const map = useMapStore((state) => state.map);
  const addLayer = useLayersStore((state) => state.addLayer);
  const addLayersChecked = useLayersStatusStore((state) => state.addLayersChecked);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);

  function addData(key: string) {
    if (key === "4fbfc039-5460-4a2c-bcc5-fcc731054469") {
      const treeData: Layer = {
        title: "line_test",
        key: "4fbfc039-5460-4a2c-bcc5-fcc731054469",
        src: "%PUBLIC_URL%/test/line_string.json",
        group: false,
        children: [],
      };

      // 设置相应全局变量
      addLayer(treeData);
      addLayersChecked(key);
      addLayersExpanded(key);

      // 读取 assets 文件下的本地 json
      axios.get(process.env.PUBLIC_URL + "/test/line_string.json").then((res) => {
        if (!map) return;

        map.addSource("4fbfc039-5460-4a2c-bcc5-fcc731054469", {
          type: "geojson",
          data: res.data,
        });
        map.addLayer({
          id: "4fbfc039-5460-4a2c-bcc5-fcc731054469",
          type: "line",
          source: "4fbfc039-5460-4a2c-bcc5-fcc731054469",
          layout: {
            visibility: "visible",
          },
        });
      });
    }

    if (key === "4a549f8d-9043-428e-9706-209ccc26fd39") {
      const treeData: Layer = {
        title: "polygon_test",
        key: "4a549f8d-9043-428e-9706-209ccc26fd39",
        src: "%PUBLIC_URL%/test/polygon.json",
        group: false,
        children: [],
      };

      // 设置相应全局变量
      addLayer(treeData);
      addLayersChecked(key);
      addLayersExpanded(key);

      // 读取 assets 文件下的本地 json
      axios.get(process.env.PUBLIC_URL + "/test/polygon.json").then((res) => {
        if (!map) return;

        map.addSource("4a549f8d-9043-428e-9706-209ccc26fd39", {
          type: "geojson",
          data: res.data,
        });
        map.addLayer({
          id: "4a549f8d-9043-428e-9706-209ccc26fd39",
          type: "fill",
          source: "4a549f8d-9043-428e-9706-209ccc26fd39",
          layout: {
            visibility: "visible",
          },
        });
      });
    }
  }

  return addData;
};

export default useAddData;
