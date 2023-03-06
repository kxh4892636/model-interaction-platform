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
import { ImageSource } from "mapbox-gl";
import useLayersAnimatedStore from "../stores/layers_animated_store";

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
  const addLayersAnimated = useLayersAnimatedStore((state) => state.addLayersAnimated);
  const updateLayersAnimated = useLayersAnimatedStore((state) => state.updateLayersAnimated);

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
  const addJSON = (id: string) => {
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const style = dataDetail.style;
      console.log(style);

      getData(id, "json").then((res) => {
        console.log(res);

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
  const addMesh = (id: string) => {
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
   */
  const addUVET = (id: string, style = "raster") => {
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const extent = dataDetail.extent;
      const imageCount: number = Number(res.transform[1]);
      let currentCount = 0;

      getData(id, "uvet", { currentImage: currentCount }, "blob").then((res) => {
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
      // NOTE node.timer type
      const intervalFunc = setInterval(() => {
        currentCount = (currentCount + 1) % imageCount;
        updateLayersAnimated(id, "currentCount", currentCount);
        // NOTE
        getData(id, "uvet", { currentImage: currentCount }, "blob")!.then((res) => {
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          (map!.getSource(id) as ImageSource).updateImage({ url: url });
        });
      }, 200);
      addLayersAnimated({
        key: id,
        currentCount: currentCount,
        imageCount: imageCount,
        intervalFunction: intervalFunc,
      });
    });
  };

  /**
   * add image to map by id
   * @param id data id
   */
  const addImage = (id: string) => {
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
  const addData = (id: string) => {
    if (!map || getKeys.getLayerKeys(layers)!.includes(id)) {
      return;
    } else {
    }
    getDataDetail(id).then((res) => {
      const dataDetail: ServerData = res;
      const type = res.type;
      const style = res.style;
      const treeData: Layer = {
        title: dataDetail.title,
        key: id,
        group: false,
        children: [],
      };
      addLayer(treeData);
      addLayersChecked(id);
      addLayersExpanded(id);

      if (type === "geojson") {
        addJSON(id);
      } else if (type === "mesh" && dataDetail.transform) {
        addMesh(id);
      } else if (type === "uvet" && dataDetail.transform) {
        if (style === "raster") {
          addUVET(id);
        } else if (style === "flow") {
          // TODO addUVET should be add style props to distinguish raster and flow
          addUVET(id);
        } else {
          console.error("the style of uvet is wrong");
        }
      } else if (type === "image") {
        addImage(id);
      } else if (type === "text") {
      } else {
        console.error("the type of data is unknown");
      }
    });
  };

  return {
    getData,
    getDataDetail,
    addData,
  };
};

export default useData;
