/*
 * @File: useData hook
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-10
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import axios from "axios";
import useMapStore from "../stores/map_store";
import useLayersStore from "../stores/layers_store";
import useLayersStatusStore from "../stores/layers_status_store";
import { useKeys } from ".";
import { Layer, ServerData } from "../types";
import { ImageSource } from "mapbox-gl";
import useLayersAnimatedStore from "../stores/animated_status_store";
import { FlowFieldManager } from "../features/map/utils/customLayer/flowfield";
import { FlowLayer } from "../features/map/utils/customLayer/flowLayer";

/**
 * @description return the function that curd data
 * @autor xiaohankong
 * @param type return the function according to type, now have get, add, detail
 */
const useData = () => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const addLayersChecked = useLayersStatusStore((state) => state.addLayersChecked);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);
  const getKeys = useKeys();
  const addAnimatedStatus = useLayersAnimatedStore((state) => state.addAnimatedStatus);
  const updateAnimatedStatus = useLayersAnimatedStore((state) => state.updateAnimatedStatus);

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
   * @param dataType the type of data, image, json, etc...
   * @param params the params of get request
   * @param responseType the type of response
   */
  // NOTE get params responsetype
  const getData = async (
    id: string,
    dataType: string = "data",
    params: object = {},
    responseType: string = "json"
  ) => {
    const data = await axios
      .get(`http://localhost:3456/data/${dataType}?id=` + id, {
        params: params,
        responseType: responseType as any,
      })
      .then((res) => {
        return res.data;
      });
    return data;
  };

  /**
   * add json to map by id
   * @param id data id
   */
  const addJSONToMap = (id: string) => {
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const style = dataDetail.style;
      if (style === "text") return;
      else;

      getData(id, "json").then((res) => {
        map!.addSource(id, {
          type: "geojson",
          data: res,
        });
        map!.addLayer({
          id: id,
          type: style as any,
          source: id,
          layout: {
            visibility: "visible",
          },
        });
      });
    });
  };

  /**
   * add mesh to map by id
   * @param id data id
   */
  const addMeshToMap = (id: string) => {
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const extent = dataDetail.extent;

      getData(id, "mesh", {}, "blob").then((res) => {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        map!.addSource(id, {
          type: "image",
          url: url,
          coordinates: [
            [extent[0], extent[3]],
            [extent[1], extent[3]],
            [extent[1], extent[2]],
            [extent[0], extent[2]],
          ],
        });
        map!.addLayer({
          id: id,
          type: "raster",
          source: id,
          paint: {
            "raster-fade-duration": 0,
          },
        });
      });
    });
  };

  /**
   * add image to map by id
   * @param id data id
   * @param style the style of uvet, raster and flow
   */
  const addUVETToMap = (id: string, style: string) => {
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const extent = dataDetail.extent;
      const imageCount: number = Number(res.transform[1]) ? Number(res.transform[1]) : 100;
      const startValue = 0;
      const endValue = imageCount - 1;
      let currentCount = startValue;

      if (style === "raster") {
        getData(id, "uvet", { currentImage: currentCount, type: "petak" }, "blob").then((res) => {
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          // NOTE source type
          map!.addSource(id, {
            type: "image",
            url: url,
            coordinates: [
              [extent[0], extent[3]],
              [extent[1], extent[3]],
              [extent[1], extent[2]],
              [extent[0], extent[2]],
            ],
          });
          // NOTE layer type
          map!.addLayer({
            id: id,
            type: "raster",
            source: id,
            paint: {
              "raster-fade-duration": 0,
            },
          });
        });
        // NOTE node.timer type
        const intervalFunc = setInterval(() => {
          updateAnimatedStatus(id, "currentCount", currentCount);
          // NOTE
          getData(id, "uvet", { currentImage: currentCount, type: "petak" }, "blob")!.then(
            (res) => {
              const blob = new Blob([res]);
              const url = window.URL.createObjectURL(blob);
              // NOTE updateImage and ImageSource
              (map!.getSource(id) as ImageSource).updateImage({ url: url });
            }
          );
          currentCount = (currentCount + 1) % (endValue + 1);
        }, 200);
        addAnimatedStatus({
          key: id,
          currentCount: currentCount,
          imageCount: imageCount,
          intervalFunction: intervalFunc,
          startValue: 0,
          endValue: endValue,
          isInterval: true,
        });
      } else if (style === "flow") {
        let flowFieldManager = new FlowFieldManager(id, dataDetail, {
          startValue: 0,
          endValue: 59,
        });
        const flowLayer = new FlowLayer(id, "2d", flowFieldManager);
        map!.addLayer(flowLayer);
        getDataDetail(id).then((res) => {
          // flow don't have intervalFunction
          addAnimatedStatus({
            key: id,
            currentCount: currentCount,
            imageCount: res.transform[1] ? Number(res.transform[1]) : 100,
            intervalFunction: null,
            startValue: 0,
            endValue: res.transform[1] ? Number(res.transform[1]) - 1 : 99,
            isInterval: false,
          });
        });
      }
    });
  };

  /**
   * add image to map by id
   * @param id data id
   */
  const addImageToMap = (id: string) => {
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const extent = dataDetail.extent;

      getData(id, "image", {}, "blob").then((res) => {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        map!.addSource(id, {
          type: "image",
          url: url,
          coordinates: [
            [extent[0], extent[3]],
            [extent[1], extent[3]],
            [extent[1], extent[2]],
            [extent[0], extent[2]],
          ],
        });
        map!.addLayer({
          id: id,
          type: "raster",
          source: id,
          paint: {
            "raster-fade-duration": 0,
          },
        });
      });
    });
  };

  /**
   * add data to map by id
   * @param id data id
   */
  const addDataToMap = (id: string) => {
    if (!map || getKeys.getLayerKeys(layers)!.includes(id)) {
      return;
    } else {
    }
    const layerKeys = getKeys.getLayerKeys(layers);
    if (layerKeys.includes(id)) return;
    else;
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const type = res.type;
      const style = res.style;

      if (type.includes("json")) {
        addJSONToMap(id);
      } else if (type === "mesh" && dataDetail.transform) {
        addMeshToMap(id);
      } else if (type === "uvet" && dataDetail.transform) {
        if (style === "raster" || style === "flow") {
          addUVETToMap(id, style);
        } else {
          console.error("the style of uvet is wrong");
        }
      } else if (type === "image") {
        addImageToMap(id);
      } else if (type === "text") {
      } else {
        console.error("the type of data is unknown");
      }
    });
  };

  const addDataToLayerTree = (id: string) => {
    if (!map || getKeys.getLayerKeys(layers)!.includes(id)) {
      return;
    } else {
    }
    const layerKeys = getKeys.getLayerKeys(layers);
    if (layerKeys.includes(id)) return;
    else;
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const treeData: Layer = {
        title: dataDetail.title,
        key: id,
        type: dataDetail.type,
        layerStyle: dataDetail.style,
        group: false,
        children: [],
      };
      addLayer(treeData);
      addLayersChecked(id);
      addLayersExpanded(id);
    });
  };

  return {
    getData,
    getDataDetail,
    addDataToMap: addDataToMap,
    addDataToLayerTree: addDataToLayerTree,
  };
};

export default useData;
