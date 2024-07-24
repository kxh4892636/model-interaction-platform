import { ModelSelect } from '@/page/model/model-select'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { LayerPanel } from './layer'
import { MapView } from './map'
import { ModelStatus } from './model/ModelStatus'
import { Model } from './model/Model'

export const ModelPage = () => {
  const modal = useModalStore((state) => state.modal)
  const isModalDisplay = useModalStore((state) => state.isModalDisplay)
  const areaName = useMetaStore((state) => state.areaName)

  return (
    <div className="relative flex h-screen w-screen flex-col">
      <div
        className="z--1 h-16 w-screen bg-[#135eb0] p-5 text-xl tracking-widest
          text-white"
      >
        111
      </div>
      <div className="flex flex-auto bg-pink-50">
        <div className="relative flex flex-auto bg-green-50">
          <div className="flex w-[24rem] flex-col bg-slate-200 px-1">
            <div className="my-0.5">
              <div
                className="flex h-10 items-center border border-slate-300
                  bg-white px-2"
              >
                <div>{`当前研究区域： ${areaName == null ? '未选择研究区域' : areaName}`}</div>
              </div>
            </div>
            <div className="mb-0.5">
              <ModelSelect></ModelSelect>
            </div>
            <div className="mb-0.5">
              <Model></Model>
            </div>
            <LayerPanel></LayerPanel>
          </div>
          <div className="relative h-full w-full">
            <ModelStatus></ModelStatus>
            <MapView></MapView>
          </div>
        </div>
      </div>
      {isModalDisplay && modal}
    </div>
  )
}
