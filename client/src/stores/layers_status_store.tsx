/*
 * @File: layers_status_store.tsx
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

interface LayerStatusStore {
  layersChecked: { data: string[]; map: string[] };
  layersExpanded: { data: string[]; map: string[] };
  layersSelected: { data: Layer | undefined; map: Layer | undefined };
  setLayersChecked: (value: string[], type: "data" | "map") => void;
  setLayersExpanded: (value: string[], type: "data" | "map") => void;
  setLayersSelected: (value: Layer | undefined, type: "data" | "map") => void;
  addLayersChecked: (key: string, type: "data" | "map") => void;
  addLayersExpanded: (key: string, type: "data" | "map") => void;
  deleteLayersChecked: (key: string, type: "data" | "map") => void;
  deleteLayersExpanded: (key: string, type: "data" | "map") => void;
}

/**
 * @description store the layer status and it's actions of data and map panel
 * @module useLayerStatusStore
 * @Author xiaohan kong
 * @export module: useLayerStatusStore
 */
export const useLayersStatusStore = create<LayerStatusStore>((set) => ({
  layersChecked: { data: [], map: [] },
  layersExpanded: { data: [], map: [] },
  layersSelected: { data: undefined, map: undefined },
  setLayersChecked: (value, type) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersChecked[type] = value;
      })
    ),
  setLayersExpanded: (value, type) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersExpanded[type] = value;
      })
    ),
  setLayersSelected: (value, type) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersSelected[type] = value;
      })
    ),
  addLayersChecked: (key, type) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersChecked[type].push(key);
      })
    ),
  addLayersExpanded: (key, type) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersExpanded[type].push(key);
      })
    ),
  deleteLayersChecked: (key, type) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersChecked[type] = draft.layersChecked[type].filter((value) => {
          return value !== key;
        });
      })
    ),
  deleteLayersExpanded: (key, type) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersExpanded[type] = draft.layersExpanded[type].filter((value) => {
          return value !== key;
        });
      })
    ),
}));
