import { DATA_FOLDER_PATH } from '@/config/env'
import { WaterModelTypeType } from '@/type'
import path from 'path'

export const getModelDataVisualization = (
  modelType: WaterModelTypeType,
  datasetPath: string,
  hours: number,
  identifier: string,
): string[] => {
  const fnMap = {
    'water-2d': () => {
      const result: string[] = []
      result.push(
        path.join(datasetPath, `flow-field-description-${identifier}.json`),
      )
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `mask-${identifier}-${index}.png`))
      }
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `uv-${identifier}-${index}.png`))
      }
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `valid-${identifier}-${index}.png`))
      }
      return result
    },
    'water-3d': () => {
      return ['']
    },
    'quality-wasp': () => {
      const result: string[] = []
      for (let i = 1; i <= 8; i++) {
        for (let j = 0; j < hours; j++) {
          result.push(path.join(datasetPath, `tnd-${identifier}-${i}-${j}.png`))
        }
      }
      return result
    },
    'quality-phreec': () => {
      const result: string[] = []
      for (let index = 0; index < hours; index++) {
        result.push(
          path.join(
            DATA_FOLDER_PATH,
            datasetPath,
            `tnd-${identifier}-${index}.png`,
          ),
        )
      }
      return result
    },
    sand: () => {
      const result: string[] = []
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `snd-${identifier}-${index}.png`))
      }
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `yuji-${identifier}-${index}.png`))
      }
      return result
    },
    mud: () => {
      const result: string[] = []
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `snd-${identifier}-${index}.png`))
      }
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `yuji-${identifier}-${index}.png`))
      }
      return result
    },
  }

  const result = fnMap[modelType]()
  return result
}
