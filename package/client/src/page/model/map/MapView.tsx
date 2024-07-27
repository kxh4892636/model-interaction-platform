import { useMapStore } from '@/store/mapStore'
import { GetMap } from '@/util/customLayer/cusLayer'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'
import { MapStatus } from './MapStatus'

export const initMap = (
  mapContainerRef: React.MutableRefObject<HTMLDivElement>,
  position: [number, number, number],
) => {
  const map = GetMap(
    'pk.eyJ1Ijoia3hoNDg5MjYzNiIsImEiOiJjbGFhcWYyNmcwNHF3M25vNXJqaW95bDZsIn0.ID03BpkSU7-I0OcehcrvlQ',
    {
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [position[0], position[1]],
      zoom: position[2],
      preserveDrawingBuffer: true,
    },
  )

  return map
}

export const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement>(document.createElement('div'))
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const map = useMapStore((state) => state.map)
  const setMap = useMapStore((state) => state.setMap)
  const position = useMapStore((state) => state.mapPosition)
  const setPosition = useMapStore((state) => state.setMapPosition)
  const setClickPosition = useMapStore((state) => state.setClickPosition)

  useEffect(() => {
    // init map
    if (mapRef.current) return

    mapRef.current = initMap(mapContainerRef, position)
    mapRef.current.addControl(
      new MapboxLanguage({
        defaultLanguage: 'zh-Hans',
      }),
    )
    setMap(mapRef.current)

    // update map center position
    mapRef.current.on('move', () => {
      if (mapRef.current) {
        setPosition([
          Number(mapRef.current.getCenter().lng.toFixed(2)),
          Number(mapRef.current.getCenter().lat.toFixed(2)),
          Number(mapRef.current.getZoom().toFixed(2)),
        ])
      }
    })

    mapRef.current.on('click', (e) => {
      setClickPosition(e.lngLat.toArray() as [number, number])
    })
  }, [])

  useEffect(() => {
    if (map) map.resize()
  }, [])

  return (
    <div className="h-full w-full">
      <MapStatus position={position}></MapStatus>
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  )
}
