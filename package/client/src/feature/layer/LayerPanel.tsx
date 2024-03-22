import { LayerTree } from './LayerTree'

export const LayerPanel = () => {
  return (
    <div className=" flex h-full w-[25rem] flex-col bg-slate-200">
      <div className=" flex flex-auto flex-col border ">
        <div
          className="mx-0.5 my-1 flex flex-1 flex-col border border-slate-300
            bg-white"
        >
          <div
            className="flex h-10 items-center border-0 border-b
              border-b-slate-300 px-2"
          >
            输入数据
          </div>
          <LayerTree type="data"></LayerTree>
        </div>
        <div
          className="mx-0.5 flex flex-1 flex-col border border-slate-300
            bg-white"
        >
          <div
            className="flex h-10 items-center border-0 border-b
              border-b-slate-300 px-2"
          >
            输出数据
          </div>
          <LayerTree type="map"></LayerTree>
        </div>
      </div>
    </div>
  )
}
