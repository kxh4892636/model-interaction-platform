/*
 * @File: use_Animate hook
 * @Author: xiaohan kong
 * @Date: 2023-03-01
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-10
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { ImageSource } from "mapbox-gl";
import { useAnimatedStatusStore } from "../../src/stores/animated_status_store";
import { useMapStore } from "../../src/stores/map_store";
import { useData } from "./";

export const useAnimate = () => {
  const map = useMapStore((state) => state.map);
  const dataAction = useData();
  const animatedStatus = useAnimatedStatusStore((state) => state.animatedStatus);
  const updateAnimatedStatus = useAnimatedStatusStore((state) => state.updateAnimatedStatus);
  const addAnimatedStatus = useAnimatedStatusStore((state) => state.addAnimatedStatus);
  const removeAnimatedStatus = useAnimatedStatusStore((state) => state.removeAnimatedStatus);

  const createAnimate = (
    id: string,
    imageCount: number,
    startValue: number = 0,
    endValue: number,
    isInterval: boolean = true,
    style: string
  ) => {
    let currentCount = startValue;
    const intervalFunc = isInterval
      ? setInterval(() => {
          updateAnimatedStatus(id, "currentCount", currentCount);
          dataAction
            .getData(id, "model", { currentImage: currentCount, type: style }, "blob")!
            .then((res) => {
              const blob = new Blob([res]);
              const url = window.URL.createObjectURL(blob);
              (map!.getSource(id) as ImageSource).updateImage({ url: url });
            });
          currentCount =
            (currentCount + 1) % (endValue + 1) === 0
              ? startValue
              : (currentCount + 1) % (endValue + 1);
        }, 200)
      : null;
    addAnimatedStatus({
      key: id,
      currentCount: currentCount,
      imageCount: imageCount,
      intervalFunction: intervalFunc,
      startValue: startValue,
      endValue: endValue,
      isInterval: isInterval,
      style: style,
    });
  };

  const pauseAnimate = (id: string) => {
    animatedStatus.forEach((value) => {
      if (value.key === id && value.intervalFunction) {
        clearInterval(value.intervalFunction);
      }
    });
  };

  const continueAnimate = (id: string, current?: number, start?: number, end?: number) => {
    animatedStatus.forEach((value) => {
      if (value.key === id && value.isInterval) {
        const info = animatedStatus.filter((value) => {
          return value.key === id;
        });
        let currentCount = current ? current : info[0].currentCount;
        const endValue = end ? end : info[0].endValue;
        const startValue = start ? start : info[0].startValue;

        const intervalFunc = setInterval(() => {
          updateAnimatedStatus(id, "currentCount", currentCount);
          dataAction
            .getData(id, "model", { currentImage: currentCount, type: info[0].style }, "blob")!
            .then((res) => {
              const blob = new Blob([res]);
              const url = window.URL.createObjectURL(blob);
              (map!.getSource(id) as ImageSource).updateImage({ url: url });
            });
          currentCount =
            (currentCount + 1) % (endValue + 1) === 0
              ? startValue
              : (currentCount + 1) % (endValue + 1);
        }, 200);
        updateAnimatedStatus(id, "intervalFunction", intervalFunc);
      } else;
    });
  };

  const removeAnimate = (id: string) => {
    animatedStatus.forEach((value) => {
      if (value.key === id && value.intervalFunction) {
        removeAnimatedStatus(id);
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
