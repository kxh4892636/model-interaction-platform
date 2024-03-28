import { getProjectTreeAPI } from '@/api/project/project.api'
import { ProjectTreeType } from '@/api/project/project.type'
import { useForceUpdate } from '@/hook/useForceUpdate'
import { useLayersStore } from '@/store/layerStore'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { LayerType, WaterModelTypeType } from '@/type'
import { message } from 'antd'
import { DataNode } from 'antd/es/tree'
import { useEffect } from 'react'
import { LayerTree } from './LayerTree'
import { LayerTreeMenu } from './LayerTreeMenu'
import { useLayerActions } from './layer.hook'
import { LayerMenuItemType } from './layer.type'

const filterLayerMenuItems = (
  layer: LayerType,
  layerMenuItems: Record<string, LayerMenuItemType>,
  layerType: string,
): LayerMenuItemType[] => {
  const result: LayerMenuItemType[] = []
  if (layerType === 'data') {
    if (!layer.isGroup) {
      if (layer.layerType === 'text') {
        const temp = layerMenuItems.download
        result.push(temp)
      } else if (layer.layerType === 'ewe') {
        //
      } else {
        const temp = layerMenuItems.map
        result.push(temp)
      }
    }
    const temp = layerMenuItems.delete
    result.push(temp)
  }
  if (layerType === 'map') {
    result.push(layerMenuItems.remove)
  }

  return result
}

const generateAntdTreeData = (
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
        children,
        key: value.layerKey,
        title: (
          <LayerTreeMenu
            title={value.layerName}
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

const generateProjectTreeData = async (
  projectID: string | null,
  modelType: WaterModelTypeType,
) => {
  if (!projectID) return null
  const response = await getProjectTreeAPI(projectID)
  if (!response.data) return null

  const loop = (origin: ProjectTreeType) => {
    const result: LayerType[] = origin.map((value) => {
      let children: LayerType[] = []
      if (value.children) {
        children = loop(value.children)
      }
      const result: LayerType = {
        children,
        isGroup: value.isGroup,
        layerKey: value.layerKey,
        layerStyle: value.layerStyle,
        layerName: value.layerName,
        modelType: value.modelType,
        layerType: value.layerType,
      }

      return result
    })

    return result
  }

  const temp: ProjectTreeType = response.data.filter(
    (value) => value.modelType === modelType,
  )
  const result = loop(temp)

  return result
}

const useLayerTreeData = () => {
  const layers = useLayersStore((state) => state.layers)
  const setLayer = useLayersStore((state) => state.setLayers)
  const projectID = useMetaStore((state) => state.projectID)
  const modelType = useMetaStore((state) => state.modelType)
  const modelTag = useModalStore((state) => state.isModalDisplay)

  useEffect(() => {
    generateProjectTreeData(projectID, modelType)
      .then((value) => {
        setLayer(value || [], 'data')
      })
      .catch(() => {
        setLayer([], 'data')
      })
  }, [projectID, modelType, modelTag])

  return layers
}

export const LayerPanel = () => {
  const [_, forceUpdate] = useForceUpdate()
  const layers = useLayerTreeData()
  const layerActions = useLayerActions()
  const layerMenuItemsMap = {
    map: {
      key: 'map',
      label: '添加至地图',
      action: () => {
        layerActions.addDataToMap()
      },
    },
    visualization: {
      key: 'visualization',
      label: '可视化',
      action: () => {
        //
      },
    },
    download: {
      key: 'download',
      label: '下载文本文件',
      action: () => {
        layerActions.downloadText()
      },
    },
    delete: {
      key: 'delete',
      label: '删除',
      action: async () => {
        const tag = await layerActions.deleteDataLayer()
        if (tag) {
          forceUpdate()
          message.info('删除文件成功', 5)
        } else {
          message.error('删除文件失败', 5)
        }
      },
    },
    remove: {
      key: 'remove',
      label: '移除',
      action: () => {
        layerActions.deleteMapLayer()
      },
    },
  }

  return (
    <div className=" flex h-full flex-col">
      <div className=" flex flex-auto flex-col ">
        <div
          className="mb-0.5 flex max-h-[40vh] flex-1 flex-col border
            border-slate-300 bg-white"
        >
          <div
            className="flex h-10 items-center border-0 border-b
              border-b-slate-300 px-2"
          >
            数据面板
          </div>
          <LayerTree
            type="data"
            treeData={generateAntdTreeData(
              layers.data,
              layerMenuItemsMap,
              'data',
            )}
          ></LayerTree>
        </div>
        <div
          className=" flex flex-1 flex-col border border-b-0 border-slate-300
            bg-white"
        >
          <div
            className="flex h-10 items-center border-0 border-b
              border-b-slate-300 px-2"
          >
            图层面板
          </div>
          <LayerTree
            type="map"
            treeData={generateAntdTreeData(
              layers.map,
              layerMenuItemsMap,
              'map',
            )}
          ></LayerTree>
        </div>
      </div>
    </div>
  )
}
