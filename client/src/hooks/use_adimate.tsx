/*
 * @File: use_adimate hook
 * @Author: xiaohan kong
 * @Date: 2023-03-01
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-01
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

// TODO comments

import { ImageSource } from "mapbox-gl";
import useLayersAnimatedStore from "../stores/layers_animated_store";
import useMapStore from "../stores/map_store";
import useData from "./use_data";

type Type = "create" | "pause" | "continue" | "remove";

// TODO can't alert each other between hooks
const useAdimate = (type: Type) => {
  const map = useMapStore((state) => state.map);
  const getData = useData("get");
  const layersAnimated = useLayersAnimatedStore((state) => state.layersAnimated);
  const updateLayersAnimated = useLayersAnimatedStore((state) => state.updateLayersAnimated);
  const addLayersAnimated = useLayersAnimatedStore((state) => state.addLayersAnimated);
  const removeLayersAnimated = useLayersAnimatedStore((state) => state.removeLayersAnimated);

  const createAdimate = (id: string, imageCount: number = 0) => {
    let currentCount = 0;
    const intervalFunc = setInterval(() => {
      currentCount = (currentCount + 1) % imageCount;
      updateLayersAnimated(id, "currentCount", currentCount);
      // NOTE
      getData(id, { type: "petak", currentImage: currentCount }, "blob")!.then((res) => {
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
  };

  const pauseAdimate = (id: string) => {
    layersAnimated.forEach((value) => {
      if (value.key === id) {
        clearInterval(value.intervalFunction);
      }
    });
  };

  const continueAdimate = (id: string) => {
    layersAnimated.forEach((value) => {
      if (value.key === id) {
        const info = layersAnimated.filter((value) => {
          return value.key === id;
        });
        let currentCount = info[0].currentCount;
        const imageCount = info[0].imageCount;
        console.log(layersAnimated);
        const intervalFunc = setInterval(() => {
          currentCount = (currentCount + 1) % imageCount;
          updateLayersAnimated(id, "currentCount", currentCount);
          // NOTE
          getData(id, { type: "petak", currentImage: currentCount }, "blob")!.then((res) => {
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            (map!.getSource(id) as ImageSource).updateImage({ url: url });
          });
        }, 100);
        updateLayersAnimated(id, "intervalFunction", intervalFunc);
      }
    });
  };

  const removeAdimate = (id: string) => {
    layersAnimated.forEach((value) => {
      if (value.key === id) {
        removeLayersAnimated(id);
        clearInterval(value.intervalFunction);
      }
    });
  };

  if (type === "continue") {
    return continueAdimate;
  } else if (type === "create") {
    return createAdimate;
  } else if (type === "pause") {
    return pauseAdimate;
  } else {
    return removeAdimate;
  }
};

export default useAdimate;
