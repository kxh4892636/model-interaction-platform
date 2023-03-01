/*
 * @File: 储存图层列表的状态信息及其 curd 操作
 * @Author: xiaohan kong
 * @Date: 2023-03-01
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-01
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

// TODO comments
import { create } from "zustand";
import produce from "immer";

type LayersAnimated = {
  key: string;
  imageCount: number;
  currentCount: number;
  intervalFunction: NodeJS.Timer;
};

interface LayersAnimatedStore {
  layersAnimated: LayersAnimated[];
  addLayersAnimated: (value: LayersAnimated) => void;
  updateLayersAnimated: (key: string, props: string, value: number | NodeJS.Timer) => void;
  removeLayersAnimated: (key: string) => void;
}

/**
 * @description
 * @module useLayerStatusStore
 * @Author xiaohan kong
 * @export module: useLayerStatusStore
 */

const useLayersAnimatedStore = create<LayersAnimatedStore>((set) => ({
  layersAnimated: [],
  addLayersAnimated: (value) =>
    set(
      produce((draft: LayersAnimatedStore) => {
        draft.layersAnimated.push(value);
      })
    ),
  updateLayersAnimated: (key, props, value) =>
    set(
      produce((draft: LayersAnimatedStore) => {
        draft.layersAnimated.forEach((item) => {
          if (item.key === key) {
            (item as any)[props] = value;
          } else {
          }
        });
      })
    ),
  removeLayersAnimated: (key) =>
    set(
      produce((draft: LayersAnimatedStore) => {
        draft.layersAnimated = draft.layersAnimated.filter((value) => {
          return value.key !== key;
        });
      })
    ),
}));

export default useLayersAnimatedStore;
