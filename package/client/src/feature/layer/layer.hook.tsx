/*
 * @File: layer action hook
 * @Author: xiaohan kong
 * @Date: 2023-03-04
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-04
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { useLayersStore } from '@/store/layerStore'
import { useMapStore } from '@/store/mapStore'
import { useModalStore } from '@/store/modalStore'
import { useProjectStatusStore } from '@/store/projectStore'
import { LayerType } from '@/type'
import { useEffect } from 'react'
import { getDataInfo, getTextData } from './layer.api'
import { DataInfoType } from './layer.type'
import {
  addMeshToMap,
  addUVETToMap,
  generateProjectTreeData,
  getGroupKeys,
  getLayerKeys,
} from './layer.util'

export const useLayerTreeData = () => {
  const layers = useLayersStore((state) => state.layers)
  const setLayer = useLayersStore((state) => state.setLayers)
  const projectID = useProjectStatusStore((state) => state.projectID)

  useEffect(() => {
    generateProjectTreeData(projectID)
      .then((value) => {
        setLayer(value || [], 'data')
      })
      .catch(() => {
        setLayer([], 'data')
      })
  }, [projectID])

  return layers
}

export const useLayerActions = () => {
  const map = useMapStore((state) => state.map)
  const layers = useLayersStore((state) => state.layers)
  const addLayer = useLayersStore((state) => state.addLayer)
  const addLayersChecked = useLayersStore((state) => state.addLayersChecked)
  const addLayersExpanded = useLayersStore((state) => state.addLayersExpanded)
  const deleteLayerByKey = useLayersStore((state) => state.deleteLayer)
  const deleteLayersChecked = useLayersStore(
    (state) => state.deleteLayersChecked,
  )
  const deleteLayersExpanded = useLayersStore(
    (state) => state.deleteLayersExpanded,
  )
  const layersSelected = useLayersStore((state) => state.layersSelected)
  const setLayersSelected = useLayersStore((state) => state.setLayersSelected)
  const setIsModalDisplay = useModalStore((state) => state.setIsModalDisplay)
  const setModal = useModalStore((state) => state.setModal)

  const downloadText = async () => {
    if (!layersSelected.data) return null
    const dataID = layersSelected.data.key
    const info = await getDataInfo(dataID)
    if (!info) return null
    const text = await getTextData(info.dataID, info.visualizationNumber - 1)
    if (!text) return false

    const blob = new Blob([text])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', info.dataName)
    a.click()
  }

  const visualizeData = async () => {
    if (!layersSelected.data) return null
    const dataID = layersSelected.data.key
    const info = await getDataInfo(dataID)
    if (!info) return null

    const fnMap: Record<string, (info: DataInfoType) => Promise<JSX.Element>> =
      {
        //
      }

    return true
  }

  const addDataToMap = async () => {
    if (!layersSelected.data || !map) return null
    const dataID = layersSelected.data.key
    if (getLayerKeys(layers.map).includes(dataID)) return null
    const info = await getDataInfo(dataID)
    if (!info) return null

    const fnMap: Record<
      string,
      (map: mapboxgl.Map, info: DataInfoType) => Promise<boolean>
    > = {
      mesh: addMeshToMap,
      uvet: addUVETToMap,
    }

    const tag = await fnMap[info.dataType](map, info)
    if (!tag) return false

    const treeData: LayerType = {
      title: info.dataName,
      key: info.dataID,
      type: info.dataType,
      style: info.dataStyle,
      input: info.isInput,
      group: false,
      children: [],
    }
    addLayer(treeData, 'map')
    addLayersChecked(dataID, 'map')
    addLayersExpanded(dataID, 'map')

    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showMapLayer = (info: any) => {
    if (!map) return
    if (!info.node.group) {
      // show and hide single layer
      if (map.getLayer(info.node.key)) {
        map.setLayoutProperty(
          info.node.key,
          'visibility',
          info.checked ? 'visible' : 'none',
        )
        // TODO
        // info.checked
        //   ? animate.continueAnimate(info.node.key)
        //   : animate.pauseAnimate(info.node.key)
      }
    } else {
      // show and hide layer group and it's son layer
      const layerKeys = getLayerKeys([info.node])
      for (const key of layerKeys) {
        if (map.getLayer(key)) {
          map.setLayoutProperty(
            key,
            'visibility',
            info.checked ? 'visible' : 'none',
          )
          // TODO
          //   info.checked
          //     ? animate.continueAnimate(key)
          //     : animate.pauseAnimate(key)
        }
      }
    }
  }

  /**
   * delete layer that is selected now
   */
  const deleteMapLayer = () => {
    if (!map || !layersSelected.map) return

    if (layersSelected.map.children.length === 0) {
      deleteLayersChecked(layersSelected.map.key, 'map')
      deleteLayersExpanded(layersSelected.map.key, 'map')
      deleteLayerByKey(layersSelected.map.key, 'map')

      // delete single layer
      if (map.getLayer(layersSelected.map.key))
        map.removeLayer(layersSelected.map.key)
      if (map.getSource(layersSelected.map.key))
        map.removeSource(layersSelected.map.key)

      // TODO
      //   animate.removeAnimate(layersSelected.map.key)
      setLayersSelected(null, 'map')
    } else {
      // delete layer group
      const layerKeys = getLayerKeys([layersSelected.map])
      const groupKeys = getGroupKeys([layersSelected.map])
      layerKeys.forEach((key: string) => {
        deleteLayersChecked(key, 'map')
        deleteLayersExpanded(key, 'map')
        deleteLayerByKey(key, 'map')
        if (map.getLayer(key)) map.removeLayer(key)
        if (map.getSource(key)) map.removeSource(key)
        // TODO
        // animate.removeAnimate(key)
        setLayersSelected(null, 'map')
      })
      groupKeys.forEach((key: string) => {
        deleteLayersChecked(key, 'map')
        deleteLayersExpanded(key, 'map')
        deleteLayerByKey(key, 'map')
      })
      setLayersSelected(null, 'map')
    }
  }

  return {
    downloadText,
    addDataToMap,
    showMapLayer,
    deleteMapLayer,
  }
}
