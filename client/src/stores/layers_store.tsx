/*
 * @File: 储存图层列表
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { create } from "zustand";
import produce from "immer";
import { Layer } from "../types";

interface LayersStore {
  layers: Layer[];
  setLayers: (value: Layer[]) => void;
  addLayer: (info: Layer) => void;
  deleteLayer: (key: string) => void;
  updateLayer: (key: string, prop: string, value: string | boolean | Layer) => void;
}

/**
 * @description 储存图层列表及其 curd 操作
 * @module useLayerStore
 * @Author xiaohan kong
 * @export module: useLayerStore
 */
const useLayersStore = create<LayersStore>((set) => ({
  layers: [],
  setLayers: (value) => set({ layers: value }),
  addLayer: (info) =>
    set(
      produce((draft) => {
        draft.layers.push(info);
      })
    ),
  deleteLayer: (key) =>
    set(
      produce((draft: LayersStore) => {
        const loop = (
          data: Layer[],
          key: string,
          callback: (value: Layer, index: number, data: Layer[]) => void
        ) => {
          data.forEach((value, index) => {
            if (value.key === key) {
              return callback(value, index, data);
            }
            if (value.children) {
              loop(value.children!, key, callback);
            }
          });
        };
        loop(draft.layers, key, (value, index, data) => {
          data.splice(index, 1);
        });
      })
    ),
  updateLayer: (key, prop, value) =>
    set(
      produce((draft) => {
        const loop = (
          data: Layer[],
          key: string,
          callback: (value: Layer, index: number, data: Layer[]) => void
        ) => {
          data.forEach((value, index) => {
            if (value.key === key) {
              return callback(value, index, data);
            }
            if (value.children) {
              loop(value.children!, key, callback);
            }
          });
        };

        loop(draft.layers, key, (item) => {
          (item as any)[prop] = value;
        });
      })
    ),
}));

export default useLayersStore;
