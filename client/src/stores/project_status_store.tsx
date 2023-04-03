/*
 * @File: store the key of project
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-03
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { create } from "zustand";

interface ProjectStatus {
  key: string;
  setKey: (key: string) => void;
}

/**
 * @description store the key of project
 * @module useProjectStatusStore
 * @Author xiaohan kong
 * @export module: useProjectStatusStore
 */
const useProjectStatusStore = create<ProjectStatus>((set) => ({
  key: "",
  setKey: (value) => set({ key: value }),
}));

export default useProjectStatusStore;
