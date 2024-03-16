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
import { Layer } from '@/type'

export const useLayerActions = () => {
  const map = useMapStore((state) => state.map)
  const deleteLayerByKey = useLayersStore((state) => state.deleteLayer)
  const deleteLayersChecked = useLayersStore(
    (state) => state.deleteLayersChecked,
  )
  const deleteLayersExpanded = useLayersStore(
    (state) => state.deleteLayersExpanded,
  )
  const layersSelected = useLayersStore((state) => state.layersSelected)
  const setLayersSelected = useLayersStore((state) => state.setLayersSelected)

  const getAllKeys = (layers: Layer[]) => {
    const keys: string[] = []
    const loop = (array: Layer[]) => {
      array.forEach((value) => {
        keys.push(value.key)
        value.children && loop(value.children)
      })
    }
    loop(layers)
    return keys
  }

  function getLayerKeys(layers: Layer[]) {
    const keys: string[] = []
    const loop = (array: Layer[]) => {
      array.forEach((value) => {
        if (!value.group) {
          keys.push(value.key)
        }
        value.children && loop(value.children)
      })
    }
    loop(layers)
    return keys
  }

  function getGroupKeys(layers: Layer[]) {
    const keys: string[] = []
    const loop = (array: Layer[]) => {
      array.forEach((value) => {
        if (value.group) {
          keys.push(value.key)
        }
        value.children && loop(value.children)
      })
    }
    loop(layers)
    return keys
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showLayer = (info: any) => {
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
  const deleteLayer = () => {
    if (!map || !layersSelected.map) return

    if (!layersSelected.map.group) {
      deleteLayersChecked(layersSelected.map.key, 'map')
      deleteLayersExpanded(layersSelected.map.key, 'map')
      deleteLayerByKey(layersSelected.map.key, 'map')

      // delete single layer
      if (map.getLayer(layersSelected.map.key))
        map.removeLayer(layersSelected.map.key)
      if (map.getSource(layersSelected.map.key))
        map.removeSource(layersSelected.map.key)
      console.log(layersSelected.map.key)

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
    showLayer,
    deleteLayer,
    getAllKeys,
    getGroupKeys,
    getLayerKeys,
  }
}
