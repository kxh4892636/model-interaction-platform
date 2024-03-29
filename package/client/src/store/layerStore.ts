/*
 * @File: layers_store.tsx
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { LayerType } from '@/type'
import { produce } from 'immer'
import { create } from 'zustand'

interface LayersStore {
  layers: { data: LayerType[]; map: LayerType[] }
  layersChecked: { data: string[]; map: string[] }
  layersExpanded: { data: string[]; map: string[] }
  layersSelected: {
    data: LayerType | null
    map: LayerType | null
  }
  layerTreeTag: number
  setLayers: (value: LayerType[], type: 'data' | 'map') => void
  addLayer: (layer: LayerType, type: 'data' | 'map') => void
  getLayer: (key: string, type: 'data' | 'map') => LayerType | null
  deleteLayer: (key: string, type: 'data' | 'map') => void
  updateLayer: (
    key: string,
    type: 'data' | 'map',
    prop: string,
    value: string | boolean | LayerType,
  ) => void
  setLayersChecked: (value: string[], type: 'data' | 'map') => void
  setLayersExpanded: (value: string[], type: 'data' | 'map') => void
  setLayersSelected: (value: LayerType | null, type: 'data' | 'map') => void
  addLayersChecked: (key: string, type: 'data' | 'map') => void
  addLayersExpanded: (key: string, type: 'data' | 'map') => void
  deleteLayersChecked: (key: string, type: 'data' | 'map') => void
  deleteLayersExpanded: (key: string, type: 'data' | 'map') => void
  forceUpdateLayerTree: () => void
}

export const useLayersStore = create<LayersStore>((set, get) => ({
  layers: { data: [], map: [] },
  layersChecked: { data: [], map: [] },
  layersExpanded: { data: [], map: [] },
  layersSelected: { data: null, map: null },
  layerTreeTag: 0,
  setLayers: (value, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layers[type] = value
      }),
    ),
  addLayer: (layer, type) =>
    set(
      produce((draft) => {
        draft.layers[type].push(layer)
      }),
    ),
  getLayer: (key, type) => {
    const loop = (
      data: LayerType[],
      key: string,
      callback: (value: LayerType, index: number, data: LayerType[]) => void,
    ) => {
      data.forEach((value, index) => {
        if (value.layerKey === key) {
          return callback(value, index, data)
        }
        if (value.children) {
          loop(value.children, key, callback)
        }
      })
    }
    const layers = get().layers[type]
    let layer: LayerType | null = null
    loop(layers, key, (value) => {
      layer = value
    })
    return layer || null
  },
  deleteLayer: (key, type) =>
    set(
      produce((draft: LayersStore) => {
        const loop = (
          data: LayerType[],
          key: string,
          callback: (
            value: LayerType,
            index: number,
            data: LayerType[],
          ) => void,
        ) => {
          data.forEach((value, index) => {
            if (value.layerKey === key) {
              return callback(value, index, data)
            }
            if (value.children) {
              loop(value.children, key, callback)
            }
          })
        }
        loop(draft.layers[type], key, (_, index, data) => {
          data.splice(index, 1)
        })
      }),
    ),
  updateLayer: (key, type, prop, value) =>
    set(
      produce((draft: LayersStore) => {
        const loop = (
          data: LayerType[],
          key: string,
          callback: (
            value: LayerType,
            index: number,
            data: LayerType[],
          ) => void,
        ) => {
          data.forEach((value, index) => {
            if (value.layerKey === key) {
              return callback(value, index, data)
            }
            if (value.children) {
              loop(value.children, key, callback)
            }
          })
        }

        loop(draft.layers[type], key, (item) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(item as any)[prop] = value
        })
      }),
    ),
  setLayersChecked: (value, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layersChecked[type] = value
      }),
    ),
  setLayersExpanded: (value, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layersExpanded[type] = value
      }),
    ),
  setLayersSelected: (value, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layersSelected[type] = value
      }),
    ),
  addLayersChecked: (key, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layersChecked[type].push(key)
      }),
    ),
  addLayersExpanded: (key, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layersExpanded[type].push(key)
      }),
    ),
  deleteLayersChecked: (key, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layersChecked[type] = draft.layersChecked[type].filter(
          (value) => {
            return value !== key
          },
        )
      }),
    ),
  deleteLayersExpanded: (key, type) =>
    set(
      produce((draft: LayersStore) => {
        draft.layersExpanded[type] = draft.layersExpanded[type].filter(
          (value) => {
            return value !== key
          },
        )
      }),
    ),
  forceUpdateLayerTree: () =>
    set({
      layerTreeTag: get().layerTreeTag + 1,
    }),
}))
