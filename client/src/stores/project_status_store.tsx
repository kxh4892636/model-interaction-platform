/*
 * @File: store the key of project
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-07
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { create } from "zustand";

interface ProjectStatus {
  key: string;
  isSpinning: boolean;
  setKey: (key: string) => void;
  setIsSpinning: (tag: boolean) => void;
}

/**
 * @description store the key of project
 * @module useProjectStatusStore
 * @Author xiaohan kong
 * @export module: useProjectStatusStore
 */
export const useProjectStatusStore = create<ProjectStatus>((set) => ({
  key: "",
  isSpinning: false,
  setKey: (value) => set({ key: value }),
  setIsSpinning: (value) => set({ isSpinning: value }),
}));
