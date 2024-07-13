import { ModelSelect } from '@/page/model/model-select'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { WaterModelTypeType } from '@/type'
import { LayerPanel } from './layer'
import { MapView } from './map'
import { ModelStatus } from './model/ModelStatus'
import { Model } from './model/Model'
import { Header } from '@/component/layout'

export const ModelPage = () => {
  const modal = useModalStore((state) => state.modal)
  const isModalDisplay = useModalStore((state) => state.isModalDisplay)
  const intervalIDMap = useMetaStore((state) => state.intervalIDMap)
  const areaName = useMetaStore((state) => state.areaName)

  const testClick = async () => {
    console.log(intervalIDMap)
  }

  const options: {
    value: WaterModelTypeType
    label: string
  }[] = [
    { value: 'water-2d', label: '水动力2D模型' },
    { value: 'water-3d', label: '水动力3D模型' },
    {
      value: 'quality-wasp',
      label: '水质模型-wasp',
    },
    {
      value: 'quality-phreec',
      label: '醋酸2D模型',
    },
    {
      value: 'quality-phreec-3d',
      label: '醋酸3D模型',
    },
    {
      value: 'sand',
      label: '泥沙模型',
    },
    {
      value: 'mud',
      label: '抛泥模型',
    },
    {
      value: 'ewe',
      label: '生态模型',
    },
  ]

  return (
    <div className="relative flex h-screen w-screen flex-col">
      <div
        className="z--1 h-16 w-screen bg-[#0f4a8a] p-5 text-xl tracking-widest
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
                <div>{`当前研究区域： ${areaName || '未选择研究区域'}`}</div>
              </div>
            </div>
            <div className="mb-0.5">
              <ModelSelect options={options}></ModelSelect>
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
