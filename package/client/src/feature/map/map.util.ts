import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken =
  'pk.eyJ1Ijoia3hoNDg5MjYzNiIsImEiOiJjbGFhcWYyNmcwNHF3M25vNXJqaW95bDZsIn0.ID03BpkSU7-I0OcehcrvlQ'

export const initMap = (
  mapContainerRef: React.MutableRefObject<HTMLDivElement>,
  position: [number, number, number],
) => {
  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [position[0], position[1]],
    zoom: position[2],
    preserveDrawingBuffer: true,
  })

  return map
}
