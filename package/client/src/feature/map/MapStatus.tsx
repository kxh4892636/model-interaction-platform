interface AppProps {
  position: [number, number, number]
}

export const MapStatus = ({ position }: AppProps) => {
  return (
    <div className="absolute right-4 top-4 z-10 rounded border border-slate-300 bg-white p-2">
      经度:{position[0]} | 纬度:{position[1]} | 缩放等级:{position[2]}
    </div>
  )
}
