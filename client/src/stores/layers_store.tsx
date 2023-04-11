/*
 * @File: layers_store.tsx
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { create } from "zustand";
import produce from "immer";
import { Layer } from "../types";

interface LayersStore {
  layers: { data: Layer[]; map: Layer[] };
  setLayers: (value: Layer[], type: "data" | "map") => void;
  addLayer: (layer: Layer, type: "data" | "map") => void;
  getLayer: (key: string, type: "data" | "map") => Layer | undefined;
  deleteLayer: (key: string, type: "data" | "map") => void;
  updateLayer: (
    key: string,
    type: "data" | "map",
    prop: string,
    value: string | boolean | Layer
  ) => void;
}

/**
 * @description store the layer and it's actions of data and map panel
 * @module useLayerStore
 * @Author xiaohan kong
 * @export module: useLayerStore
 */
export const useLayersStore = create<LayersStore>((set, get) => ({
  layers: { data: [], map: [] },
  setLayers: (value, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layers[type] = value;
      })
    ),
  addLayer: (layer, type) =>
    set(
      produce((draft) => {
        draft.layers[type].push(layer);
      })
    ),
  getLayer: (key, type) => {
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
    const layers = get().layers[type];
    let layer: Layer | undefined = undefined;
    loop(layers, key, (value, index, data) => {
      layer = value;
    });
    return layer ? layer : undefined;
  },
  deleteLayer: (key, type) =>
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
              loop(value.children, key, callback);
            }
          });
        };
        loop(draft.layers[type], key, (value, index, data) => {
          data.splice(index, 1);
        });
      })
    ),
  updateLayer: (key, type, prop, value) =>
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

        loop(draft.layers[type], key, (item) => {
          (item as any)[prop] = value;
        });
      })
    ),
}));
