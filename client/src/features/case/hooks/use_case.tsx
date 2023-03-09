/*
 * @File: use_case hook
 * @Author: xiaohan kong
 * @Date: 2023-03-09
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import axios from "axios";
import { useData, useKeys } from "../../../hooks";
import useLayersStatusStore from "../../../stores/layers_status_store";
import useLayersStore from "../../../stores/layers_store";
import { Layer, ServerCase } from "../../../types";

const useCase = () => {
  const layers = useLayersStore((state) => state.layers);
  const addLayer = useLayersStore((state) => state.addLayer);
  const addLayersChecked = useLayersStatusStore((state) => state.addLayersChecked);
  const addLayersExpanded = useLayersStatusStore((state) => state.addLayersExpanded);
  const dataActions = useData();
  const getKeys = useKeys();

  const addCase = (id: string) => {
    axios.get("http://localhost:3456/case/case?id=" + id).then(async (res) => {
      const caseData: ServerCase = res.data;
      caseData.data.forEach((key) => {
        dataActions.addDataToMap(key);
      });
      const id = crypto.randomUUID();
      console.log(id);

      let groupLayer: Layer = {
        title: caseData.title,
        key: id,
        group: true,
        children: [],
      };
      const allKeys = getKeys.getAllKeys(layers);
      for (let index = 0; index < caseData.data.length; index++) {
        let key = caseData.data[index];
        if (allKeys.includes(key)) continue;
        await dataActions.getDataDetail(key).then((res) => {
          const layer: Layer = {
            title: res.title,
            key: key,
            group: false,
            children: [],
          };
          addLayersChecked(id);
          addLayersExpanded(id);
          groupLayer.children.push(layer);
        });
        if (index === caseData.data.length - 1) {
          console.log(groupLayer);
          addLayer(groupLayer);
        }
      }
    });
  };

  return { addCase };
};

export default useCase;
