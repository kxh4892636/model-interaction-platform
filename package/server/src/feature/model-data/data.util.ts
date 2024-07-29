import { WaterDataTypeType, WaterModelTypeType } from '@/type'
import { createReadStream } from 'fs'
import path from 'path'
import { createInterface } from 'readline'

const getMeshDataOfCoord = async (
  lng: number,
  lat: number,
  meshPath: string,
): Promise<number[]> => {
  let minD2 = Infinity
  let res = 0
  const rl = createInterface(createReadStream(meshPath))

  for await (const line of rl) {
    const list = line.split(',').map((value) => Number(value))
    if (list.length === 2) continue
    if (list.length === 3) break
    const curLng = list[1]
    const curLat = list[2]
    const value = list[3]
    const curD2 = (curLng - lng) ** 2 + (curLat - lat) ** 2
    if (curD2 < minD2) {
      res = value
      minD2 = curD2
    }
  }

  return [res]
}

const getUvetDataOfCoord = async (
  lng: number,
  lat: number,
  uvetPath: string,
): Promise<number[]> => {
  let minD2 = Infinity
  let res: number[] = []
  const rl = createInterface(createReadStream(uvetPath))

  for await (const line of rl) {
    const list = line.split(/\s+/).map((value) => Number(value))
    if (list.length === 1 || !Number.isInteger(list[0])) continue
    const curLng = list[1]
    const curLat = list[2]
    const curD2 = (curLng - lng) ** 2 + (curLat - lat) ** 2
    if (curD2 < minD2) {
      res = list.slice(3)
      minD2 = curD2
    }
  }

  return res
}

export const getDataOfCoord = async (
  lng: number,
  lat: number,
  dataType: WaterDataTypeType,
  modelType: WaterModelTypeType,
  modelFolderPath: string,
  fileName: string,
  identifier: string,
) => {
  console.log(modelFolderPath, fileName, dataType)
  const fnMap: Record<WaterDataTypeType, () => Promise<number[]>> = {
    mesh: async () => {
      fileName = fileName.replace('gr3', 'csv')
      if (modelType === 'water-3d')
        modelFolderPath = path.dirname(modelFolderPath)
      const filePath = path.join(modelFolderPath, fileName)
      return getMeshDataOfCoord(lng, lat, filePath)
    },
    uvet: async () => {
      fileName = fileName
        .replace(/\.dat$/, `-${identifier}-total.txt`)
        .replace(/_/g, '-')
      const filePath = path.join(modelFolderPath, fileName)
      return getUvetDataOfCoord(lng, lat, filePath)
    },
    snd: async () => {
      const index = fileName[3]
      if (modelType === 'water-3d')
        fileName = `snd-${index}-${identifier}-total.txt`
      else fileName = `snd-${identifier}-total.txt`
      const filePath = path.join(modelFolderPath, fileName)
      return getUvetDataOfCoord(lng, lat, filePath)
    },
    tnd: async () => {
      const index = fileName[3]
      fileName = `tnd-${identifier}-${index}-total.txt`
      const filePath = path.join(modelFolderPath, fileName)
      return getUvetDataOfCoord(lng, lat, filePath)
    },
    ph: async () => {
      fileName = `ph-${identifier}-total.txt`
      const filePath = path.join(modelFolderPath, fileName)
      return getUvetDataOfCoord(lng, lat, filePath)
    },
    yuji: async () => {
      fileName = `yuji-${identifier}-total.txt`
      const filePath = path.join(modelFolderPath, fileName)
      return getUvetDataOfCoord(lng, lat, filePath)
    },
    mud: async () => {
      const index = fileName[3]
      fileName = `tnd-${identifier}-${index}-total.txt`
      const filePath = path.join(modelFolderPath, fileName)
      return getUvetDataOfCoord(lng, lat, filePath)
    },
    text: function (): Promise<number[]> {
      throw new Error('Function not implemented.')
    },
    geojson: function (): Promise<number[]> {
      throw new Error('Function not implemented.')
    },
    ewe: function (): Promise<number[]> {
      throw new Error('Function not implemented.')
    },
    none: function (): Promise<number[]> {
      throw new Error('Function not implemented.')
    },
  }
  return await fnMap[dataType]()
}
