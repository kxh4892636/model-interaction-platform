/*
 * @File: useAppInit hook
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-03
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import axios from "axios";
import useMapStore from "../stores/map_store";
import useLayersStore from "../stores/layers_store";
import useLayersStatusStore from "../stores/layers_status_store";
import { useKeys } from ".";
import useLayersAnimatedStore from "../stores/animated_status_store";
import usePopupStore from "../stores/popup_store";
import useProjectStatusStore from "../stores/project_status_store";

/**
 * @description return the function that curd data
 * @autor xiaohankong
 * @param type return the function according to type, now have get, add, detail
 */
const useInit = () => {
  const setLayers = useLayersStore((state) => state.setLayers);
  const setLayersChecked = useLayersStatusStore((state) => state.setLayersChecked);
  const setLayersExpanded = useLayersStatusStore((state) => state.setLayersExpanded);
  const setLayersSelected = useLayersStatusStore((state) => state.setLayersSelected);
  const clearAnimatedStatus = useLayersAnimatedStore((state) => state.clearAnimatedStatus);
  const setModelPopup = usePopupStore((state) => state.setModelPopup);
  const setIsSpinning = useProjectStatusStore((state) => state.setIsSpinning);

  const clearStoreDataExcludeMapAndProject = () => {
    axios.request({ url: "http://localhost:3456/data/init", method: "get" }).then((res) => {
      console.log(res.data);
    });
    clearAnimatedStatus();
    setLayersChecked([]);
    setLayersExpanded([]);
    setLayersSelected(undefined);
    setLayers([]);
    setModelPopup(<></>);
    setIsSpinning(false);
  };

  return { clearStoreDataExcludeMapAndProject };
};

export default useInit;
