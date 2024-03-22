/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DATA_FOLDER_PATH } from '@/config/env'
import { copyFolder, copySelectFilesInFolder } from '@/util/fs'
import { execa } from 'execa'
import { copyFile } from 'fs/promises'
import path from 'path'
import { datasetService } from '../dataset/dataset.service'
import { dataDao } from '../modal-data/data.dao'
import { modelDao } from './model.dao'
import { quality } from './model.service.quality'
import { sand } from './model.service.sand'
import { water } from './model.service.water'
import { ModelInfoType } from './model.type'

export const copyModelData = async (
  paramsID: string[],
  dstDatasetPath: string,
  uvetInfo?: {
    data_id: string
    data_name: string
    data_type: string
    data_style: string
    data_extent: number[]
    data_timestamp: string
    data_file_path: string
    data_input: boolean
    data_visualization: string[]
  },
) => {
  let meshExtent: number[] = []
  // copy exe
  await copyFolder(
    path.join(DATA_FOLDER_PATH, dstDatasetPath, '../water/model'),
    path.join(DATA_FOLDER_PATH, dstDatasetPath, 'model'),
  )
  await copyFolder(
    path.join(DATA_FOLDER_PATH, dstDatasetPath, '../sand/model'),
    path.join(DATA_FOLDER_PATH, dstDatasetPath, 'model'),
  )
  await copyFolder(
    path.join(DATA_FOLDER_PATH, dstDatasetPath, '../quality/model'),
    path.join(DATA_FOLDER_PATH, dstDatasetPath, 'model'),
  )
  // copy water model result and mesh31
  if (uvetInfo) {
    const uvetModelFolderPath = path.dirname(uvetInfo.data_file_path)
    await copySelectFilesInFolder(
      path.join(DATA_FOLDER_PATH, uvetModelFolderPath),
      path.join(DATA_FOLDER_PATH, dstDatasetPath, 'model'),
      ['et', 'vn', 'vt', 'mesh31', 'vgrid'],
    )
    await copySelectFilesInFolder(
      path.join(DATA_FOLDER_PATH, uvetModelFolderPath, '../output'),
      path.join(DATA_FOLDER_PATH, dstDatasetPath, 'output'),
      ['mesh31'],
    )
  }
  const promiseList = paramsID.map(async (dataID) => {
    const dataInfo = await dataDao.getDataInfo(dataID)
    if (!dataInfo) throw Error()
    // only in water model
    if (dataInfo.data_type === 'mesh') {
      meshExtent = dataInfo.data_extent
      await copyFolder(
        path.join(DATA_FOLDER_PATH, dataInfo.data_file_path, '../../output'),
        path.join(DATA_FOLDER_PATH, dstDatasetPath, 'output'),
      )
    }
    // other params
    const fileName = path.basename(dataInfo.data_file_path)
    const dstPath = path.join(dstDatasetPath, 'model', fileName)
    if (dataInfo.data_file_path !== dstPath) {
      await copyFile(
        path.join(DATA_FOLDER_PATH, dataInfo.data_file_path),
        path.join(DATA_FOLDER_PATH, dstPath),
      )
    }
  })
  await Promise.all(promiseList)
  return meshExtent
}

export const stopModel = async (modelID: string) => {
  try {
    const modelInfo = await modelDao.getModal(modelID)
    if (!modelInfo) return false

    for (let index = 0; index < modelInfo!.model_pid.length; index++) {
      const pid = modelInfo!.model_pid[index]
      await execa(`taskkill /f /t /pid ${pid}`, {
        shell: true,
        windowsHide: true,
      }).catch(() => {
        //
      })
    }

    await modelDao.deleteModal(modelID)
    datasetService.deleteDataset(modelInfo!.model_dataset_id!)
    return true
  } catch (error) {
    return false
  }
}

export const getModelInfo = async (
  modelID: string,
): Promise<ModelInfoType | null> => {
  const info = await modelDao.getModal(modelID)
  if (!info) return null
  const result: ModelInfoType = {
    modelDatasetID: info.model_dataset_id,
    modelID: info.model_id,
    modelStatus: info.model_status,
    progress: info.model_progress,
  }
  return result
}

export const modelService = {
  runModel: async (
    model: 'water' | 'quality' | 'sand',
    modelName: string,
    projectID: string,
    modelID: string,
    paramsID: string,
    hours: number,
    uvetID: string | null,
  ) => {
    const fnMap = {
      water,
      quality,
      sand,
    }
    const fn = fnMap[model]
    await fn(modelName, projectID, modelID, paramsID, hours, uvetID || '')
  },
  stopModal: stopModel,
  getModelInfo,
}
