import mapboxgl from 'mapbox-gl'

export const addImageToMap = (
  map: mapboxgl.Map,
  dataID: string,
  blob: Blob,
  extent: number[],
) => {
  const url = window.URL.createObjectURL(blob)
  map!.addSource(dataID, {
    type: 'image',
    url: url,
    coordinates: [
      [extent[0], extent[3]],
      [extent[1], extent[3]],
      [extent[1], extent[2]],
      [extent[0], extent[2]],
    ],
  })
  map!.addLayer({
    id: dataID,
    type: 'raster',
    source: dataID,
    paint: {
      'raster-fade-duration': 0,
    },
  })
}
