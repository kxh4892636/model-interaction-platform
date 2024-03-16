import { useLayersStore } from '@/store/layerStore'
import { Tree } from 'antd'
import { useLayerActions } from './layer.hook'

interface AppProps {
  children: JSX.Element
  type: 'data' | 'map'
}
export const LayerTree = ({ children, type }: AppProps) => {
  const layers = useLayersStore((state) => state.layers)
  const layersChecked = useLayersStore((state) => state.layersChecked)
  const layersExpanded = useLayersStore((state) => state.layersExpanded)
  const setLayersChecked = useLayersStore((state) => state.setLayersChecked)
  const setLayersExpanded = useLayersStore((state) => state.setLayersExpanded)
  const setLayersSelected = useLayersStore((state) => state.setLayersSelected)
  const layerActions = useLayerActions()

  return (
    <Tree
      className="flex-auto overflow-auto"
      showIcon
      icon={children}
      checkable
      onCheck={(checkedKeys, info) => {
        // show or hide layer
        setLayersChecked(checkedKeys as string[], type)
        layerActions.showLayer(info)
      }}
      checkedKeys={layersChecked.map}
      onExpand={(expandedKeys) => {
        // expand or collapse layer
        setLayersExpanded(expandedKeys as string[], type)
      }}
      expandedKeys={layersExpanded.map}
      blockNode
      onSelect={(_, e) => {
        // get selected layer node data
        if (e.selected) {
          setLayersSelected(e.node, type)
        }
      }}
      treeData={layers[type]}
    />
  )
}
