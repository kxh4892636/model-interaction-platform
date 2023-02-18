/*
 * @File: useGetKeys hook
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Layer } from "../types";

type Type = "all" | "layer" | "group";

/**
 * @description get function that return keys of a speculiar type of layers
 * @autor xiaohan kong
 * @param type return funciton according to type, have getAllKeys, getLayerKeys and getGroupkeys
 */
const useGetKeys = (type: Type) => {
  /**
   * get keys of layer and layer group
   * @param layers layers
   */
  const getAllKeys = (layers: Layer[]) => {
    let keys: string[] = [];
    const loop = (array: Layer[]) => {
      array.forEach((value) => {
        keys.push(value.key);
        if (!value.hasOwnProperty("children")) {
          return null;
        }
        const array = value["children"];
        loop(array);
      });
    };
    loop(layers);
    return keys;
  };

  /**
   * get keys of layers
   * @param layers layers
   */
  function getLayerKeys(layers: Layer[]) {
    let keys: string[] = [];
    const loop = (array: Layer[]) => {
      array.forEach((value) => {
        if (!value.group) {
          keys.push(value.key);
        }
        if (!value.hasOwnProperty("children")) {
          return null;
        }
        const array = value["children"];
        loop(array);
      });
    };
    loop(layers);
    return keys;
  }

  /**
   * get keys of layer group
   * @param layers layers
   */
  function getGroupKeys(layers: Layer[]) {
    let keys: string[] = [];
    const loop = (array: Layer[]) => {
      array.forEach((value) => {
        if (value.group) {
          keys.push(value.key);
        }
        if (!value.hasOwnProperty("children")) {
          return null;
        }
        const array = value["children"];
        loop(array);
      });
    };
    loop(layers);
    return keys;
  }

  if (type === "all") {
    return getAllKeys;
  } else if (type === "group") {
    return getGroupKeys;
  } else if (type === "layer") {
    return getLayerKeys;
  } else {
    return () => console.log("useGetKeys args error");
  }
};

export default useGetKeys;
