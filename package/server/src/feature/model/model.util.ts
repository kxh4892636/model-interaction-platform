import { DATA_FOLDER_PATH } from '@/config/env'
import path from 'path'
import { ModelType } from './model.type'

export const getModelDataVisualization = (
  modelType: ModelType,
  datasetPath: string,
  hours: number,
  num?: number,
): string[] => {
  const fnMap = {
    water: () => {
      const result: string[] = []
      result.push(path.join(datasetPath, 'output/flow_field_description.json'))
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `output/mask_${index}.png`))
      }
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `output/uv_${index}.png`))
      }
      for (let index = 0; index < hours; index++) {
        result.push(path.join(datasetPath, `output/valid_${index}.png`))
      }
      return result
    },
    quality: () => {
      const result: string[] = []
      for (let index = 0; index < hours; index++) {
        result.push(
          path.join(
            DATA_FOLDER_PATH,
            datasetPath,
            `output/tnd_${num}_${index}.png`,
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
  }

  const result = fnMap[modelType]()
  return result
}

// await prisma.data.update({
//   where: {
//     data_id: '40dc0b6e-78b1-48f7-a558-c655b4459582',
//   },
//   data: {
//     data_visualization: getModelDataVisualization(
//       'water',
//       '\\project\\1711200452607\\1711200503722',
//       72,
//     ),
//   },
// })

// console.log('fi')
