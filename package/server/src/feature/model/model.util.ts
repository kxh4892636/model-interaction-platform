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
      const result: string[] = []
      ;['down', 'middle', 'up'].forEach((title) => {
        result.push(
          path.join(
            datasetPath,
            `flow-field-description-${title}-${identifier}.json`,
          ),
        )
        for (let index = 0; index < hours; index++) {
          result.push(
            path.join(datasetPath, `mask-${title}-${identifier}-${index}.png`),
          )
        }
        for (let index = 0; index < hours; index++) {
          result.push(
            path.join(datasetPath, `uv-${title}-${identifier}-${index}.png`),
          )
        }
        for (let index = 0; index < hours; index++) {
          result.push(
            path.join(datasetPath, `valid-${title}-${identifier}-${index}.png`),
          )
        }
      })
      for (let i = 1; i <= 3; i++) {
        for (let j = 0; j < hours; j++) {
          result.push(path.join(datasetPath, `snd-${identifier}-${i}-${j}.png`))
        }
      }

      return result
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
        result.push(path.join(datasetPath, `ph-${identifier}-${index}.png`))
      }
      return result
    },
    'quality-phreec-3d': () => {
      const result: string[] = []
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `ph-${identifier}-${index}.png`))
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
      for (let i = 1; i <= 2; i++) {
        for (let j = 0; j < hours; j++) {
          result.push(path.join(datasetPath, `tnd-${identifier}-${i}-${j}.png`))
        }
      }
      return result
    },
    ewe: () => {
      return []
    },
  }

  const result = fnMap[modelType]()
  return result
}
