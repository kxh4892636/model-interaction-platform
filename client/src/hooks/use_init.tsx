/*
 * @File: useAppInit hook
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-07
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { useLayersStore } from "../stores/layers_store";
import { useLayersStatusStore } from "../stores/layers_status_store";
import { useAnimatedStatusStore } from "../stores/animated_status_store";
import { useViewStore } from "../stores/view_store";
import { useProjectStatusStore } from "../stores/project_status_store";

/**
 * @description return the function that curd data
 * @autor xiaohankong
 * @param type return the function according to type, now have get, add, detail
 */
export const useInit = () => {
  const setLayers = useLayersStore((state) => state.setLayers);
  const setLayersChecked = useLayersStatusStore((state) => state.setLayersChecked);
  const setLayersExpanded = useLayersStatusStore((state) => state.setLayersExpanded);
  const setLayersSelected = useLayersStatusStore((state) => state.setLayersSelected);
  const clearAnimatedStatus = useAnimatedStatusStore((state) => state.clearAnimatedStatus);
  const setView = useViewStore((state) => state.setView);
  const setIsSpinning = useProjectStatusStore((state) => state.setIsSpinning);

  const clearStoreDataExcludeMapAndProject = () => {
    clearAnimatedStatus();
    ["data", "map"].forEach((type) => {
      setLayersChecked([], type as "data" | "map");
      setLayersExpanded([], type as "data" | "map");
      setLayersSelected(undefined, type as "data" | "map");
      setLayers([], type as "data" | "map");
    });
    setView(<></>);
    setIsSpinning(false);
  };

  return { clearStoreDataExcludeMapAndProject };
};
