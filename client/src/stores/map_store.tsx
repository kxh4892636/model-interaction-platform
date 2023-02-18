/*
 * @File: 存储 map 对象的全局状态变量
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { create } from "zustand";

interface MapStore {
  map: mapboxgl.Map | undefined;
  setMap: (value: mapboxgl.Map) => void;
}

/**
 * @description 存储 map 对象的全局状态变量
 * @module useMapStore
 * @Author xiaohan kong
 * @export module: useMapStore
 */
const useMapStore = create<MapStore>((set) => ({
  map: undefined,
  setMap: (value) => set({ map: value }),
}));

export default useMapStore;
