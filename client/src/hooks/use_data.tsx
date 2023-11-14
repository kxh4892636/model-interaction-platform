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
import { ImageSource } from "mapbox-gl";
import { serverHost } from "../config/global_variable";
import { useLayerColorStore } from "../features/data/store/layer_color_store";
import { useAnimatedStatusStore } from "../stores/animated_status_store";
import { useLayersStatusStore } from "../stores/layers_status_store";
import { useLayersStore } from "../stores/layers_store";
import { useMapStore } from "../stores/map_store";
import { Layer, ServerData } from "../types";
import { FlowLayer } from "../utils/customLayer/flowLayer";
import { FlowFieldManager } from "../utils/customLayer/flowfield";
import { useKeys } from "./";

/**
 * @description return the function that curd data
 * @autor xiaohankong
 * @param type return the function according to type, now have get, add, detail
 */
export const useData = () => {
  const map = useMapStore((state) => state.map);
  const layers = useLayersStore((state) => state.layers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const addLayersChecked = useLayersStatusStore(
    (state) => state.addLayersChecked
  );
  const addLayersExpanded = useLayersStatusStore(
    (state) => state.addLayersExpanded
  );
  const getKeys = useKeys();
  const addAnimatedStatus = useAnimatedStatusStore(
    (state) => state.addAnimatedStatus
  );
  const updateAnimatedStatus = useAnimatedStatusStore(
    (state) => state.updateAnimatedStatus
  );
  const getColor = useLayerColorStore((state) => state.getColor);

  /**
   * get data by id
   * @param id data id
   */
  const getDataDetail = async (id: string): Promise<ServerData> => {
    const data = await axios
      .get(serverHost + "/api/data/detail?id=" + id, { timeout: 1000 })
      .then((res) => {
        return res.data.content as ServerData;
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
  const getData = async (
    id: string,
    dataType: string = "data",
    params: object = {},
    responseType: string = "json"
  ) => {
    const data = await axios
      .get(serverHost + `/api/data/${dataType}?id=` + id, {
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
    const color = getColor();
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const style = dataDetail.style;
      if (style === "text") return;
      else;

      getData(id, "json").then((res) => {
        map!.addSource(id, {
          type: "geojson",
          data: res.content,
        });
        map!.addLayer({
          id: id,
          type: style as any,
          source: id,
          layout: {
            visibility: "visible",
          },
          paint: {
            "circle-color": color,
            "circle-radius": 4,
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
   * add model to map by id
   * @param id data id
   * @param style the type of model, tnd, flow and ...
   */
  const addModelToMap = (id: string, style: string) => {
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const extent = dataDetail.extent;
      const imageCount: number = Number(res.transformNum)
        ? Number(res.transformNum)
        : 100;
      const startValue = 0;
      const endValue = imageCount - 1 > 23 ? 23 : imageCount - 1;
      let currentCount = startValue;
      if (style === "quality" || style === "yuji" || style === "snd") {
        getData(
          id,
          "model",
          { currentImage: currentCount, type: style },
          "blob"
        ).then((res) => {
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
        const intervalFunc = setInterval(() => {
          updateAnimatedStatus(id, "currentCount", currentCount);
          getData(
            id,
            "model",
            { currentImage: currentCount, type: style },
            "blob"
          )!.then((res) => {
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            (map!.getSource(id) as ImageSource).updateImage({ url: url });
          });
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
          style: style,
        });
      } else if (style === "water") {
        let flowFieldManager = new FlowFieldManager(id, dataDetail, {
          startValue: 0,
          endValue: res.transformNum
            ? Number(res.transformNum) - 1 > 23
              ? 23
              : Number(res.transformNum) - 1
            : 59,
        });
        const flowLayer = new FlowLayer(id, "2d", flowFieldManager);
        map!.addLayer(flowLayer);
        getDataDetail(id).then((res) => {
          // flow don't have intervalFunction
          addAnimatedStatus({
            key: id,
            currentCount: currentCount,
            imageCount: res.transformNum ? Number(res.transformNum) : 60,
            intervalFunction: null,
            startValue: 0,
            endValue: res.transformNum
              ? Number(res.transformNum) - 1 > 23
                ? 23
                : Number(res.transformNum) - 1
              : 59,
            isInterval: false,
            style: style,
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
    if (!map || getKeys.getLayerKeys(layers.map)!.includes(id)) {
      return;
    } else;
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const type = res.type;
      const style = res.style;
      if (type.includes("json")) {
        addJSONToMap(id);
      } else if (type === "mesh" && Number(dataDetail.transformNum)) {
        addMeshToMap(id);
      } else if (type === "model" && Number(dataDetail.transformNum)) {
        if (
          style === "quality" ||
          style === "water" ||
          style === "yuji" ||
          style === "snd"
        ) {
          addModelToMap(id, style);
        } else {
          console.error("the style of uvet is wrong");
        }
      } else if (type === "image") {
        addImageToMap(id);
      } else if (type === "point") {
        addJSONToMap(id);
      } else if (type === "ewemodel") {
      } else {
        console.error("the type of data is unknown");
      }
    });
  };
  const addDataToLayerTree = (id: string) => {
    if (getKeys.getLayerKeys(layers.map).includes(id)) {
      return;
    } else;
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const treeData: Layer = {
        title: dataDetail.title,
        key: id,
        type: dataDetail.type,
        layerStyle: dataDetail.style,
        group: false,
        children: [],
        input: dataDetail.input,
      };
      addLayer(treeData, "map");
      addLayersChecked(id, "map");
      addLayersExpanded(id, "map");
    });
  };

  const isVisualized = async (key: string) => {
    const data = (
      await axios({
        method: "get",
        url: serverHost + "/api/visualization/state",
        params: {
          key: key,
        },
      })
    ).data;
    return data.status === "success" ? true : false;
  };

  const visualizeMesh = async (key: string) => {
    const data = (
      await axios({
        method: "post",
        url: serverHost + "/api/visualization/mesh",
        data: {
          key: key,
        },
      })
    ).data;
    return data.status;
  };

  const visualizePoint = async (pointKey: string, meshKey: string) => {
    const data = (
      await axios({
        method: "post",
        url: serverHost + "/api/visualization/point",
        data: {
          pointKey: pointKey,
          meshKey: meshKey,
        },
      })
    ).data;
    return data.status;
  };

  const visualizeData = async (key: string, meshKey?: string) => {
    return await getDataDetail(key).then((res) => {
      const dataDetail: ServerData = res;
      const type = dataDetail.type;
      if (type.includes("mesh")) {
        return visualizeMesh(key);
      } else if (type.includes("point")) {
        return visualizePoint(key, meshKey!);
      } else;
      return { status: "fail" };
    });
  };

  return {
    getData,
    getDataDetail,
    addDataToMap,
    addDataToLayerTree,
    isVisualized,
    visualizeData,
  };
};
