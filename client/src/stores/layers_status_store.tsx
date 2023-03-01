/*
 * @File: 储存图层列表的状态信息及其 curd 操作
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

interface LayerStatusStore {
  layersChecked: string[];
  layersExpanded: string[];
  layersSelected: Layer | undefined;
  setLayersChecked: (value: string[]) => void;
  setLayersExpanded: (value: string[]) => void;
  setLayersSelected: (value: Layer) => void;
  addLayersChecked: (key: string) => void;
  addLayersExpanded: (key: string) => void;
  removeLayersChecked: (key: string) => void;
  removeLayersExpanded: (key: string) => void;
}

/**
 * @description 储存图层列表状态信息及其cur操作
 * @module useLayerStatusStore
 * @Author xiaohan kong
 * @export module: useLayerStatusStore
 */
const useLayersStatusStore = create<LayerStatusStore>((set) => ({
  layersChecked: [],
  layersExpanded: [],
  layersSelected: undefined,
  setLayersChecked: (value) => set({ layersChecked: value }),
  setLayersExpanded: (value) => set({ layersExpanded: value }),
  setLayersSelected: (value) => set({ layersSelected: value }),
  addLayersChecked: (key) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersChecked.push(key);
      })
    ),
  addLayersExpanded: (key) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersExpanded.push(key);
      })
    ),
  removeLayersChecked: (key) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersChecked = draft.layersChecked.filter((value) => {
          return value !== key;
        });
      })
    ),
  removeLayersExpanded: (key) =>
    set(
      produce((draft: LayerStatusStore) => {
        draft.layersExpanded = draft.layersExpanded.filter((value) => {
          return value !== key;
        });
      })
    ),
}));

export default useLayersStatusStore;
