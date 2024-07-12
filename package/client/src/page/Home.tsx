import { LayerPanel } from '@/feature/layer'
import { MapView } from '@/feature/map'
import { Model } from '@/feature/model'
import { ModelSelect } from '@/feature/model-select'
import { ModelStatus } from '@/feature/model/ModelStatus'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { WaterModelTypeType } from '@/type'

export const Home = () => {
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
        className="flex h-14 items-center bg-[#1b6ec8] p-3 text-xl
          tracking-widest text-white"
      >
        港口水环境与生态动力学精细化模拟平台
        {/* <button className="h-4 w-4 bg-red-400" onClick={testClick}></button> */}
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
