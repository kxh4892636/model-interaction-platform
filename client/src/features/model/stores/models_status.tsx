/*
 * @File: ModelsStatus
 * @Author: xiaohan kong
 * @Date: 2023-03-25
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-25
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import produce from "immer";
import { create } from "zustand";

/**
 * @description store info of models
 * @module useModelsStatus
 * @author xiaohan kong
 * @export module: useModelsStatus
 */

interface ModelStatus {
  model: string;
  title: string;
  paramKeys: string[];
  projKey: string | null;
  isRunning: boolean;
  resultKeys: string[] | null;
  datasetKey: string | null;
  percent: number;
  intervalStore: NodeJS.Timer | null;
  pid: number | null;
}

interface ModelStatusStore {
  modelStatus: ModelStatus[];
  addModelStatus: (modelStatus: ModelStatus) => void;
  getModelStatus: (model: string) => ModelStatus | undefined;
  updateModelStatus: (
    model: string,
    prop:
      | "model"
      | "title"
      | "paramKeys"
      | "projKey"
      | "isRunning"
      | "resultKeys"
      | "datasetKey"
      | "percent"
      | "intervalStore"
      | "pid",
    value: string | string[] | boolean | number | NodeJS.Timer
  ) => void;
  removeModelStatus: (model: string) => void;
}

export const useModelsStatus = create<ModelStatusStore>((set, get) => ({
  modelStatus: [],
  addModelStatus: (modelStatus) => {
    set(
      produce((draft: ModelStatusStore) => {
        draft.modelStatus.push(modelStatus);
      })
    );
  },
  getModelStatus: (model) => {
    const modelStatus = get().modelStatus;
    const ms: ModelStatus | undefined = modelStatus.filter((ms) => ms.model === model)[0];
    return ms;
  },
  updateModelStatus: (model, prop, value) => {
    set(
      produce((draft: ModelStatusStore) => {
        draft.modelStatus.forEach((ms) => {
          if (ms.model === model) {
            (ms as any)[prop] = value;
          } else;
        });
      })
    );
  },
  removeModelStatus: (model) => {
    set(
      produce((draft: ModelStatusStore) => {
        draft.modelStatus = draft.modelStatus.filter((ms) => ms.model !== model);
      })
    );
  },
}));
