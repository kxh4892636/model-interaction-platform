import { AntdTreeInterface, LayerType } from '@/type'
import { DataNode } from 'antd/es/tree'
import { addImageToMap } from '../map/map.util'
import { LayerTreeMenu } from './LayerTreeMenu'
import { getMeshData, getProjectTree } from './layer.api'
import { DataInfoType, LayerMenuItemType, ProjectTreeType } from './layer.type'

const filterLayerMenuItems = (
  layer: LayerType,
  layerMenuItems: Record<string, LayerMenuItemType>,
  layerType: string,
): LayerMenuItemType[] => {
  const result: LayerMenuItemType[] = []
  if (!layer.group && layerType === 'data') {
    if (layer.type === 'text') {
      const temp = layerMenuItems['download']
      result.push(temp)
    } else {
      const temp = layerMenuItems['map']
      temp.action
      result.push(layerMenuItems['map'])
    }
  }
  if (!layer.input) {
    result.push(layerMenuItems['delete'])
  }
  if (layerType === 'map') {
    result.push(layerMenuItems['remove'])
  }

  return result
}

export const generateProjectTreeData = async (projectID: string | null) => {
  if (!projectID) return null
  const response = await getProjectTree(projectID)
  if (!response) return null

  const loop = (origin: ProjectTreeType) => {
    const result: LayerType[] = origin.map((value) => {
      let children: LayerType[] = []
      if (value.children) {
        children = loop(value.children)
      }
      const result: LayerType = {
        children: children,
        group: value.group,
        input: value.isInput,
        key: value.key,
        style: value.layerStyle,
        title: value.title,
        type: value.layerType,
      }

      return result
    })

    return result
  }

  const result = loop(response)

  return result
}

export const generateAntdTreeData = (
  layers: LayerType[],
  layerMenuItems: Record<string, LayerMenuItemType>,
  layerType: string,
) => {
  const loop = (origin: LayerType[]) => {
    const result: DataNode[] = origin.map((value) => {
      let children: DataNode[] = []
      if (value.children) {
        children = loop(value.children)
      }
      const filterMenuItems = filterLayerMenuItems(
        value,
        layerMenuItems,
        layerType,
      )
      const result = {
        children: children,
        key: value.key,
        title: (
          <LayerTreeMenu
            title={value.title}
            layerMenuItems={filterMenuItems}
          ></LayerTreeMenu>
        ),
      }

      return result
    })

    return result
  }

  const result = loop(layers)

  return result
}

export const getAllKeys = (layers: LayerType[]) => {
  const keys: string[] = []
  const loop = (array: LayerType[]) => {
    array.forEach((value) => {
      keys.push(value.key)
      value.children && loop(value.children)
    })
  }
  loop(layers)
  return keys
}

export const getLayerKeys = (layers: LayerType[] | AntdTreeInterface[]) => {
  const keys: string[] = []
  const loop = (array: LayerType[] | AntdTreeInterface[]) => {
    array.forEach((value) => {
      if (value.children.length === 0) {
        keys.push(value.key)
      }
      value.children && loop(value.children)
    })
  }
  loop(layers)
  return keys
}

export const getGroupKeys = (layers: LayerType[] | AntdTreeInterface[]) => {
  const keys: string[] = []
  const loop = (array: LayerType[] | AntdTreeInterface[]) => {
    array.forEach((value) => {
      if (value.children.length === 0) {
        keys.push(value.key)
      }
      value.children && loop(value.children)
    })
  }
  loop(layers)
  return keys
}

export const addMeshToMap = async (map: mapboxgl.Map, info: DataInfoType) => {
  const blob = await getMeshData(info.dataID, info.visualizationNumber - 1)
  if (!blob) return false
  addImageToMap(map, info.dataID, blob, info.dataExtent)
  return true
}
