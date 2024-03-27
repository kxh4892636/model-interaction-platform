import { getMeshAPI } from '@/api/model-data/data.api'
import { DataInfoType } from '@/api/model-data/data.type'
import { LayerType } from '@/type'
import { FlowLayer } from '@/util/customLayer/flowLayer'
import { FlowFieldManager } from '@/util/customLayer/flowfield'
import { addImageToMap } from '../../util/mapbox.util'

export const antdTreeToProjectTree = (layer: LayerType[], key: string) => {
  const loop = (origin: LayerType[], key: string) => {
    origin.forEach((value) => {
      if (value.layerKey === key) {
        result = value
      }
      if (value.children) {
        loop(value.children, key)
      }
    })
  }

  let result: LayerType | null = null
  loop(layer, key)

  return result as unknown as LayerType
}

export const getAllKeys = (layers: LayerType[]) => {
  const keys: string[] = []
  const loop = (array: LayerType[]) => {
    array.forEach((value) => {
      keys.push(value.layerKey)
      value.children && loop(value.children)
    })
  }
  loop(layers)
  return keys
}

export const getLayerKeys = (layers: LayerType[]) => {
  const keys: string[] = []
  const loop = (array: LayerType[]) => {
    array.forEach((value) => {
      if (value.children.length === 0) {
        keys.push(value.layerKey)
      }
      value.children && loop(value.children)
    })
  }
  loop(layers)
  return keys
}

export const getGroupKeys = (layers: LayerType[]) => {
  const keys: string[] = []
  const loop = (array: LayerType[]) => {
    array.forEach((value) => {
      if (value.children.length !== 0) {
        keys.push(value.layerKey)
      }
      value.children && loop(value.children)
    })
  }
  loop(layers)
  return keys
}

export const addMeshToMap = async (map: mapboxgl.Map, info: DataInfoType) => {
  const blob = await getMeshAPI(info.dataID, info.visualizationNumber - 1)
  if (!(blob instanceof Blob)) return false
  addImageToMap(map, info.dataID, blob, info.dataExtent)
  return true
}

export const addUVETToMap = async (map: mapboxgl.Map, info: DataInfoType) => {
  try {
    let flowFieldManager = new FlowFieldManager(info.dataID, info)
    const flowLayer = new FlowLayer(info.dataID, '2d', flowFieldManager)
    map.addLayer(flowLayer)
    return true
  } catch (error) {
    return false
  }
}
