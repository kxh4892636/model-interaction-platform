import { useLayersStore } from '@/store/layerStore'
import { Tree } from 'antd'
import { useLayerActions, useLayerTreeData } from './layer.hook'
import { generateAntdTreeData } from './layer.util'

interface AppProps {
  type: 'data' | 'map'
}
export const LayerTree = ({ type }: AppProps) => {
  const layers = useLayerTreeData()
  const layersChecked = useLayersStore((state) => state.layersChecked)
  const layersExpanded = useLayersStore((state) => state.layersExpanded)
  const setLayersChecked = useLayersStore((state) => state.setLayersChecked)
  const setLayersExpanded = useLayersStore((state) => state.setLayersExpanded)
  const setLayersSelected = useLayersStore((state) => state.setLayersSelected)
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
      action: () => {},
    },
    download: {
      key: 'download',
      label: '下载文本文件',
      action: () => {
        layerActions.downloadText()
      },
    },
    rename: {
      key: 'rename',
      label: '重命名',
      action: () => undefined,
    },
    delete: {
      key: 'delete',
      label: '删除',
      action: () => undefined,
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
    <Tree
      className="flex-auto overflow-auto p-2"
      checkable={type === 'map'}
      onCheck={(checkedKeys, info) => {
        setLayersChecked(checkedKeys as string[], type)
        if (type === 'map') {
          layerActions.showMapLayer(info)
        }
      }}
      checkedKeys={layersChecked[type]}
      onExpand={(expandedKeys) => {
        setLayersExpanded(expandedKeys as string[], type)
      }}
      expandedKeys={layersExpanded[type]}
      blockNode
      onSelect={(_, info) => {
        setLayersSelected(
          {
            key: info.node.key as string,
            title: info.node.title as string,
            children: info.node.children as any,
          },
          type,
        )
      }}
      onRightClick={(info) => {
        setLayersSelected(
          {
            key: info.node.key as string,
            title: info.node.title as string,
            children: info.node.children as any,
          },
          type,
        )
      }}
      treeData={generateAntdTreeData(layers[type], layerMenuItemsMap, type)}
    />
  )
}
