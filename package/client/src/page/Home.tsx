import { MapView } from '@/feature/map/MapView'
import { useMapStore } from '@/store/mapStore'

export const Home = () => {
  const isDisplay = useMapStore((state) => state.isDisplay)
  return (
    <div className="relative flex h-screen w-screen flex-col">
      <div className="flex h-14 items-center bg-slate-200 text-xl">
        <div className="mx-3 text-xl font-medium">
          港口水环境与生态动力学精细化模拟平台
        </div>
      </div>
      <div className="flex w-full flex-auto bg-pink-50">
        <div className="w-16 bg-red-50"></div>
        <div className="relative flex-auto bg-green-50">
          <MapView display={isDisplay}></MapView>
        </div>
      </div>
    </div>
  )
}
