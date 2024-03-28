import mapboxgl, { ImageSource } from 'mapbox-gl'

export const addJsonToMap = (
  map: mapboxgl.Map,
  dataID: string,
  json: object,
  style: string,
) => {
  const colors = ['#e41a1c', '#003eb3', '#237804', '#984ea3', '#ff7f00']
  map!.addSource(dataID, {
    type: 'geojson',
    data: json as any,
  })
  map!.addLayer({
    id: dataID,
    type: style as 'circle',
    source: dataID,
    layout: {
      visibility: 'visible',
    },
    paint: {
      'circle-color': colors[Math.floor(Math.random() * colors.length)],
      'circle-radius': 4,
    },
  })
}

export const addImageToMap = (
  map: mapboxgl.Map,
  dataID: string,
  blob: Blob,
  extent: number[],
) => {
  const url = window.URL.createObjectURL(blob)
  map!.addSource(dataID, {
    type: 'image',
    url,
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

export const addImageSequenceToMap = (
  map: mapboxgl.Map,
  dataID: string,
  blobList: Blob[],
  extent: number[],
) => {
  let time = 0
  const length = blobList.length
  const url = URL.createObjectURL(blobList[time % length])
  map!.addSource(dataID, {
    type: 'image',
    url,
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
  const intervalFunc = setInterval(() => {
    const url = URL.createObjectURL(blobList[time % length])
    ;(map!.getSource(dataID) as ImageSource).updateImage({ url })
    time++
  }, 200)

  return intervalFunc
}
