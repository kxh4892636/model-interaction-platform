/*
 * @File: pop_store
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-07
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { create } from "zustand";
/**
 * @description store View components
 * @module ViewStore
 * @author xiaohan kong
 * @export module: ViewStore
 */
interface ViewStore {
  view: JSX.Element;
  viewTag: boolean;
  setView: (element: JSX.Element) => void;
  setViewTag: (tag: boolean) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  view: <></>,
  viewTag: false,
  setView: (element) => {
    set({ view: element });
  },
  setViewTag(tag) {
    set({ viewTag: tag });
  },
}));
