import { postDatasetActonAPI } from '@/api/dataset/dataset.api'
import {
  getDataInfoAPI,
  getImageAPI,
  getTextAPI,
  postDataActonAPI,
} from '@/api/model-data/data.api'
import { DataInfoType } from '@/api/model-data/data.type'
import { useLayersStore } from '@/store/layerStore'
import { useMapStore } from '@/store/mapStore'
import { useMetaStore } from '@/store/metaStore'
import { LayerType } from '@/type'
import { addImageSequenceToMap } from '@/util/mapbox.util'
import {
  addGeoJsonLayerToMap,
  addMeshLayerToMap,
  addUVETLayerToMap,
  getLayerKeys,
} from './layer.util'

export const useLayerActions = () => {
  const map = useMapStore((state) => state.map)
  const layers = useLayersStore((state) => state.layers)
  const addLayer = useLayersStore((state) => state.addLayer)
  const addLayersChecked = useLayersStore((state) => state.addLayersChecked)
  const addLayersExpanded = useLayersStore((state) => state.addLayersExpanded)
  const deleteLayerByKey = useLayersStore((state) => state.deleteLayer)
  const deleteLayersChecked = useLayersStore(
    (state) => state.deleteLayersChecked,
  )
  const deleteLayersExpanded = useLayersStore(
    (state) => state.deleteLayersExpanded,
  )
  const layersSelected = useLayersStore((state) => state.layersSelected)
  const setLayersSelected = useLayersStore((state) => state.setLayersSelected)
  const addInterValID = useMetaStore((state) => state.addInterValID)
  const getInterValIDByLayerID = useMetaStore(
    (state) => state.getInterValIDByLayerID,
  )
  const removeInterValIDByLayerID = useMetaStore(
    (state) => state.removeInterValIDByLayerID,
  )

  const downloadText = async () => {
    if (!layersSelected.data) return false
    const dataID = layersSelected.data.layerKey
    const info = await getDataInfoAPI(dataID)
    if (!info.data) return false
    const text = await getTextAPI(
      info.data.dataID,
      info.data.visualizationNumber - 1,
    )
    if (!text.data) return false

    const blob = new Blob([text.data])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', info.data.dataName)
    a.click()
  }

  // const visualizeData = async () => {
  //   if (!layersSelected.data) return null
  //   const dataID = layersSelected.data.key
  //   const info = await getDataInfo(dataID)
  //   if (!info) return null

  //   const fnMap: Record<string, (info: DataInfoType) => Promise<JSX.Element>> =
  //     {
  //       //
  //     }

  //   return true
  // }

  const addImageSequenceLayerToMap = async (
    map: mapboxgl.Map,
    info: DataInfoType,
  ) => {
    const blobList: Blob[] = []
    for (let index = 0; index < info.visualizationNumber; index++) {
      const blob = await getImageAPI(info.dataID, index)
      if (!(blob instanceof Blob)) continue
      blobList.push(blob)
    }
    const intervalID = addImageSequenceToMap(
      map,
      info.dataID,
      blobList,
      info.dataExtent,
    )

    addInterValID(layersSelected.data!.layerKey, intervalID)
    return true
  }

  const addDataToMap = async () => {
    if (!layersSelected.data || !map) return false
    const dataID = layersSelected.data.layerKey
    if (getLayerKeys(layers.map).includes(dataID)) return false
    const info = await getDataInfoAPI(dataID)
    if (!info.data) return false

    const fnMap: Record<
      string,
      (map: mapboxgl.Map, info: DataInfoType) => Promise<boolean>
    > = {
      mesh: addMeshLayerToMap,
      uvet: addUVETLayerToMap,
      geojson: addGeoJsonLayerToMap,
      tnd: addImageSequenceLayerToMap,
      snd: addImageSequenceLayerToMap,
      yuji: addImageSequenceLayerToMap,
    }

    const tag = await fnMap[info.data.dataType](map, info.data)
    if (!tag) return false

    const treeData: LayerType = {
      layerName: info.data.dataName,
      layerKey: info.data.dataID,
      layerType: info.data.dataType,
      layerStyle: info.data.dataStyle,
      isGroup: false,
      modelType: info.data.modelType,
      children: [],
    }
    addLayer(treeData, 'map')
    addLayersChecked(dataID, 'map')
    addLayersExpanded(dataID, 'map')

    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showMapLayer = (info: any) => {
    if (!map) return
    if (!info.node.group) {
      // show and hide single layer
      if (map.getLayer(info.node.key)) {
        map.setLayoutProperty(
          info.node.key,
          'visibility',
          info.checked ? 'visible' : 'none',
        )
      }
    } else {
      // show and hide layer group and it's son layer
      const layerKeys = getLayerKeys([info.node])
      for (const key of layerKeys) {
        if (map.getLayer(key)) {
          map.setLayoutProperty(
            key,
            'visibility',
            info.checked ? 'visible' : 'none',
          )
        }
      }
    }
  }

  /**
   * delete layer that is selected now
   */
  const deleteMapLayer = () => {
    if (!map || !layersSelected.map) return

    deleteLayersChecked(layersSelected.map.layerKey, 'map')
    deleteLayersExpanded(layersSelected.map.layerKey, 'map')
    deleteLayerByKey(layersSelected.map.layerKey, 'map')

    // delete single layer
    if (map.getLayer(layersSelected.map.layerKey))
      map.removeLayer(layersSelected.map.layerKey)
    if (map.getSource(layersSelected.map.layerKey))
      map.removeSource(layersSelected.map.layerKey)
    setLayersSelected(null, 'map')

    const intervalID = getInterValIDByLayerID(layersSelected.map.layerKey)
    if (!intervalID) return
    clearInterval(intervalID)
    removeInterValIDByLayerID(layersSelected.map.layerKey)
  }

  /**
   * delete layer that is selected now
   */
  const deleteDataLayer = async () => {
    if (!layersSelected.data) return

    if (!layersSelected.data.isGroup) {
      // delete single layer
      const response = await postDataActonAPI({
        action: 'delete',
        dataID: layersSelected.data.layerKey,
      })
      if (response.status === 'error') return false

      deleteLayersChecked(layersSelected.data.layerKey, 'data')
      deleteLayersExpanded(layersSelected.data.layerKey, 'data')
      deleteLayerByKey(layersSelected.data.layerKey, 'data')
    } else {
      // delete layer group
      const response = await postDatasetActonAPI({
        datasetAction: 'delete',
        datasetID: layersSelected.data.layerKey,
      })
      if (response.status === 'error') return false

      const layerKeys = getLayerKeys([layersSelected.data])
      layerKeys.forEach((key: string) => {
        deleteLayersChecked(key, 'data')
        deleteLayersExpanded(key, 'data')
        deleteLayerByKey(key, 'data')
        setLayersSelected(null, 'data')
      })
    }
    setLayersSelected(null, 'data')
    return true
  }

  return {
    downloadText,
    addDataToMap,
    showMapLayer,
    deleteDataLayer,
    deleteMapLayer,
  }
}
