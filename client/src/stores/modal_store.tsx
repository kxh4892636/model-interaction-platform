/*
 * @File: modal_store.tsx
 * @Author: xiaohan kong
 * @Date: 2023-04-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { create } from "zustand";
/**
 * @description store Modal components
 * @module ModalStore
 * @author xiaohan kong
 * @export module: ModalStore
 */
interface ModalStore {
  modal: JSX.Element;
  modalTag: boolean;
  setModal: (element: JSX.Element) => void;
  setModalTag: (tag: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: <></>,
  modalTag: false,
  setModal: (element) => {
    set({ modal: element });
  },
  setModalTag(tag) {
    set({ modalTag: tag });
  },
}));
