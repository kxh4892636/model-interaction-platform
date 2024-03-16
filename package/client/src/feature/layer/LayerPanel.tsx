import { LayerTree } from './LayerTree'
import { LayerTreeMenu } from './LayerTreeMenu'
import { useLayerActions } from './layer.hook'

export const LayerPanel = () => {
  const layerActions = useLayerActions()
  const layerMenuItems = [
    {
      key: 'delete',
      label: '删除该图层',
      action: layerActions.deleteLayer,
    },
  ]

  return (
    <div className=" flex h-full w-[25rem] flex-auto flex-col bg-slate-200">
      <div className=" flex flex-auto flex-col border ">
        <div className="m-1 flex flex-1 flex-col border border-slate-300">
          <div
            className="flex h-10 items-center border-0 border-b
              border-b-slate-300 bg-white px-2"
          >
            输入数据
          </div>
          <LayerTree type="data">
            <LayerTreeMenu layerMenuItems={layerMenuItems} />
          </LayerTree>
        </div>
        <div className="mx-1 flex flex-1 flex-col border border-slate-300">
          <div
            className="flex h-10 items-center border-0 border-b
              border-b-slate-300 bg-white px-2"
          >
            输出数据
          </div>
          <LayerTree type="map">
            <LayerTreeMenu layerMenuItems={layerMenuItems} />
          </LayerTree>
        </div>
      </div>
    </div>
  )
}
