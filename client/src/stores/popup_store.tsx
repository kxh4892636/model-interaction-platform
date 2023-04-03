/*
 * @File: pop_store
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-03
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { create } from "zustand";
import { produce } from "immer";

/**
 * @description store popup components
 * @module PopupStore
 * @author xiaohan kong
 * @export module: PopupStore
 */
interface PopupStore {
  popupStore: { model: JSX.Element; nonModel: JSX.Element[] };
  popupTagStore: { model: boolean; nonModel: boolean };
  setModelPopup: (element: JSX.Element) => void;
  getModelPopup: () => JSX.Element;
  removeModelPopup: () => JSX.Element;
  setModelPopupTag: (tag: boolean) => void;
}

const usePopupStore = create<PopupStore>((set, get) => ({
  popupStore: {
    model: <></>,
    nonModel: [],
  },
  popupTagStore: { model: false, nonModel: false },
  setModelPopup: (element) => {
    set(
      produce((draft: PopupStore) => {
        draft.popupStore.model = element;
      })
    );
  },
  getModelPopup: () => {
    const modelPopup = get().popupStore.model;
    return modelPopup;
  },
  removeModelPopup: () => {
    const modelPopup = get().popupStore.model;
    set(
      produce((draft: PopupStore) => {
        draft.popupStore.model = <></>;
      })
    );
    return modelPopup;
  },
  setModelPopupTag: (tag) => {
    set(
      produce((draft: PopupStore) => {
        draft.popupTagStore.model = tag;
      })
    );
  },
}));

export default usePopupStore;
