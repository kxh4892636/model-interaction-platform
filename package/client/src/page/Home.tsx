import { LayerPanel } from '@/feature/layer'
import { MapView } from '@/feature/map'
import { Model } from '@/feature/model'
import { ModelSelect } from '@/feature/model-select'
import { useForceUpdate } from '@/hook/useForceUpdate'
import { useLayersStore } from '@/store/layerStore'
import { useMapStore } from '@/store/mapStore'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { WaterModelTypeType } from '@/type'

const test = (number: React.MutableRefObject<number>) => {
  number.current++
}

export const Home = () => {
  const modal = useModalStore((state) => state.modal)
  const isModalDisplay = useModalStore((state) => state.isModalDisplay)
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const forceUpdate = useForceUpdate()
  const projectID = useMetaStore((state) => state.projectID)
  const map = useMapStore((state) => state.map)
  const layersSelected = useLayersStore((state) => state.layersSelected)

  const testClick = async () => {
    console.log(layersSelected)
  }

  const options: {
    value: WaterModelTypeType
    label: string
  }[] = [
    { value: 'water-2d', label: '水动力模型' },
    {
      value: 'quality-wasp',
      label: '水质模型-wasp',
    },
    {
      value: 'sand',
      label: '泥沙模型',
    },
  ]

  return (
    <div className="relative flex h-screen w-screen flex-col">
      <div
        className="flex h-14 items-center bg-[#1b6ec8] p-3 text-xl
          tracking-widest text-white"
      >
        港口水环境与生态动力学精细化模拟平台
        <button className="h-4 w-4 bg-red-400" onClick={testClick}></button>
      </div>
      <div className="flex flex-auto bg-pink-50">
        <div className="relative flex flex-auto bg-green-50">
          <div className="flex w-[24rem] flex-col bg-slate-200 px-1">
            <div className="my-0.5">
              <ModelSelect options={options}></ModelSelect>
            </div>
            <div className="mb-0.5">
              <Model></Model>
            </div>
            <LayerPanel></LayerPanel>
          </div>
          <MapView></MapView>
        </div>
      </div>
      {isModalDisplay && modal}
    </div>
  )
}
