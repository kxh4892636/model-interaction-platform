/*
 * @File: 存储地图当前中心位置的全局状态变量
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { create } from "zustand";

interface MapPositionStore {
  position: [number, number, number];
  setPosition: (value: [number, number, number]) => void;
}

/**
 * @description 存储当前地图中心位置的全局状态变量
 * @module useMapPositionStore
 * @Author xiaohan kong
 * @export module: useMapPositionStore
 */
const useMapPositionStore = create<MapPositionStore>((set) => ({
  position: [119.8618, 26.7011, 9],
  setPosition: (value) => set({ position: value }),
}));

export default useMapPositionStore;
