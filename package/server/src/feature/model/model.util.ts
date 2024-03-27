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
      for (let index = 0; index < hours; index++) {
        result.push(
          path.join(
            DATA_FOLDER_PATH,
            datasetPath,
            `output/tnd-${1}-${index}.png`,
          ),
        )
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
            `output/tnd_${1}_${index}.png`,
          ),
        )
      }
      return result
    },
    sand: () => {
      const result: string[] = []
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `output/snd_${index}.png`))
      }
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `output/yuji_${index}.png`))
      }
      return result
    },
    mud: () => {
      const result: string[] = []
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `output/snd_${index}.png`))
      }
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `output/yuji_${index}.png`))
      }
      return result
    },
  }

  const result = fnMap[modelType]()
  return result
}
