/*
 * @File: the status of animated data
 * @Author: xiaohan kong
 * @Date: 2023-03-01
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-10
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { create } from "zustand";
import produce from "immer";

type AnimatedStatusType = {
  key: string;
  imageCount: number;
  currentCount: number;
  startValue: number;
  endValue: number;
  isInterval: boolean;
  intervalFunction: NodeJS.Timer | null;
};

type AnimatedStatusProps =
  | "key"
  | "imageCount"
  | "currentCount"
  | "startValue"
  | "endValue"
  | "isInterval"
  | "intervalFunction";

interface AnimatedStatusStore {
  animatedStatus: AnimatedStatusType[];
  addAnimatedStatus: (value: AnimatedStatusType) => void;
  getAnimatedStatus: (key: string) => AnimatedStatusType | undefined;
  updateAnimatedStatus: (
    key: string,
    props: AnimatedStatusProps,
    value: number | NodeJS.Timer
  ) => void;
  removeAnimatedStatus: (key: string) => void;
  clearAnimatedStatus: () => void;
}

/**
 * @description
 * @module useLayerStatusStore
 * @Author xiaohan kong
 * @export module: useLayerStatusStore
 */
const useAnimatedStatusStore = create<AnimatedStatusStore>((set, get) => ({
  animatedStatus: [],
  addAnimatedStatus: (value) =>
    set(
      produce((draft: AnimatedStatusStore) => {
        draft.animatedStatus.push(value);
      })
    ),
  getAnimatedStatus: (key) => {
    let info: AnimatedStatusType | undefined = undefined;
    const animatedStatus = get().animatedStatus;
    animatedStatus.forEach((value) => {
      if (value.key === key) {
        info = value;
      } else;
    });
    return info ? info : undefined;
  },
  updateAnimatedStatus: (key, props, value) =>
    set(
      produce((draft: AnimatedStatusStore) => {
        draft.animatedStatus.forEach((item) => {
          if (item.key === key) {
            (item as any)[props] = value;
          } else {
          }
        });
      })
    ),
  removeAnimatedStatus: (key) =>
    set(
      produce((draft: AnimatedStatusStore) => {
        draft.animatedStatus = draft.animatedStatus.filter((value) => {
          return value.key !== key;
        });
      })
    ),
  clearAnimatedStatus: () => {
    produce((draft: AnimatedStatusStore) => {
      draft.animatedStatus = [];
    });
  },
}));

export default useAnimatedStatusStore;
