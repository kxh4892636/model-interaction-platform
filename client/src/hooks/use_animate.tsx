/*
 * @File: use_Animate hook
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

// TODO can't alert each other between hooks
const useAnimate = () => {
  const map = useMapStore((state) => state.map);
  const dataAction = useData();
  const layersAnimated = useLayersAnimatedStore((state) => state.layersAnimated);
  const updateLayersAnimated = useLayersAnimatedStore((state) => state.updateLayersAnimated);
  const addLayersAnimated = useLayersAnimatedStore((state) => state.addLayersAnimated);
  const removeLayersAnimated = useLayersAnimatedStore((state) => state.removeLayersAnimated);

  const createAnimate = (id: string, imageCount: number = 0) => {
    let currentCount = 0;
    const intervalFunc = setInterval(() => {
      currentCount = (currentCount + 1) % imageCount;
      updateLayersAnimated(id, "currentCount", currentCount);
      // NOTE
      dataAction.getData(id, "uvet", { currentImage: currentCount }, "blob")!.then((res) => {
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

  const pauseAnimate = (id: string) => {
    layersAnimated.forEach((value) => {
      if (value.key === id) {
        clearInterval(value.intervalFunction);
      }
    });
  };

  const continueAnimate = (id: string) => {
    layersAnimated.forEach((value) => {
      if (value.key === id) {
        const info = layersAnimated.filter((value) => {
          return value.key === id;
        });
        let currentCount = info[0].currentCount;
        const imageCount = info[0].imageCount;
        const intervalFunc = setInterval(() => {
          currentCount = (currentCount + 1) % imageCount;
          updateLayersAnimated(id, "currentCount", currentCount);
          // NOTE
          dataAction.getData(id, "uvet", { currentImage: currentCount }, "blob")!.then((res) => {
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            (map!.getSource(id) as ImageSource).updateImage({ url: url });
          });
        }, 150);
        updateLayersAnimated(id, "intervalFunction", intervalFunc);
      }
    });
  };

  const removeAnimate = (id: string) => {
    layersAnimated.forEach((value) => {
      if (value.key === id) {
        removeLayersAnimated(id);
        clearInterval(value.intervalFunction);
      }
    });
  };

  return {
    continueAnimate,
    createAnimate,
    pauseAnimate,
    removeAnimate,
  };
};

export default useAnimate;
