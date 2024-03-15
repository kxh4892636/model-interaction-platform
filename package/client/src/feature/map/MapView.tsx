import { useMapStore } from '@/store/mapStore'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'
import { MapStatus } from './MapStatus'
import { initMap } from './map.util'

interface AppProps {
  display: boolean
}

export const MapView = ({ display }: AppProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(document.createElement('div'))
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const setMap = useMapStore((state) => state.setMap)
  const position = useMapStore((state) => state.mapPosition)
  const setPosition = useMapStore((state) => state.setMapPosition)

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
  })

  return (
    <>
      <MapStatus position={position}></MapStatus>
      <div
        ref={mapContainerRef}
        style={{
          position: display ? 'absolute' : 'relative',
        }}
        className="h-full w-full"
      />
    </>
  )
}
