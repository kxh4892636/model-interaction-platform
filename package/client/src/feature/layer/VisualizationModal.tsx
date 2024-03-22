import { useLayersStore } from '@/store/layerStore'
import { useModalStore } from '@/store/modalStore'

interface AppProps {
  //   children: JSX.Element
}
export const VisualizationModal = ({}: AppProps) => {
  const setIsModalDisplay = useModalStore((state) => state.setIsModalDisplay)
  const setModal = useModalStore((state) => state.setModal)
  const layersSelected = useLayersStore((state) => state.layersSelected)

  return (
    <div
      className="absolute z-20 flex h-screen w-screen bg-slate-500/20"
      onClick={() => {}}
    >
      <div
        className="relative left-[15vw] top-[10vh] flex h-[80vh] w-[66vw]
          flex-col rounded-xl border border-slate-300 bg-white shadow-lg
          shadow-slate-300"
      >
        <div
          className="absolute right-4 top-3 bg-slate-400"
          onClick={() => {
            setModal(<></>)
            setIsModalDisplay(false)
          }}
        >
          关闭
        </div>
        <div
          className="flex h-12 items-center border-0 border-b border-slate-300
            px-4"
        >
          {'可视化'}
        </div>
      </div>
    </div>
  )
}
