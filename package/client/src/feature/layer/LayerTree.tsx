import { useLayersStore } from '@/store/layerStore'
import { Tree } from 'antd'
import { DataNode } from 'antd/es/tree'
import { useLayerActions } from './layer.hook'
import { antdTreeToProjectTree } from './layer.util'

interface LayerTreePropsInterface {
  type: 'data' | 'map'
  treeData: DataNode[]
}
export const LayerTree = ({ type, treeData }: LayerTreePropsInterface) => {
  const layers = useLayersStore((state) => state.layers)
  const layerActions = useLayerActions()
  const layersChecked = useLayersStore((state) => state.layersChecked)
  const layersExpanded = useLayersStore((state) => state.layersExpanded)
  const setLayersChecked = useLayersStore((state) => state.setLayersChecked)
  const setLayersExpanded = useLayersStore((state) => state.setLayersExpanded)
  const setLayersSelected = useLayersStore((state) => state.setLayersSelected)

  return (
    <Tree
      className="h-[30vh] w-[300px] flex-auto overflow-y-auto overflow-x-clip
        p-2"
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
          antdTreeToProjectTree(layers[type], info.node.key as string),
          type,
        )
      }}
      onRightClick={(info) => {
        setLayersSelected(
          antdTreeToProjectTree(layers[type], info.node.key as string),
          type,
        )
      }}
      treeData={treeData}
    />
  )
}
