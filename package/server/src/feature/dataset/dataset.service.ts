import { DATA_FOLDER_PATH } from '@/config/env'
import { copyFolder } from '@/util/fs'
import { randomUUID } from 'crypto'
import { mkdir } from 'fs/promises'
import path from 'path'
import { datasetDao } from './dataset.dao'

export const datasetService = {
  createDataset: async (
    projectPath: string,
    templateFolderPath: string,
    projectTree: Record<string, string[]>,
  ) => {
    const result: Record<string, string> = {}
    const timeStamp = Date.now().toString()
    const datasetNameList = Object.keys(projectTree)
    for (const datasetName of datasetNameList) {
      const datasetPath = path.join(projectPath, datasetName)
      // create folder
      await mkdir(path.join(DATA_FOLDER_PATH, datasetPath), {
        recursive: true,
      })
      // copy dataset and its all data
      await copyFolder(
        path.join(DATA_FOLDER_PATH, templateFolderPath),
        path.join(DATA_FOLDER_PATH, projectPath),
      )
      const datasetID = randomUUID()
      result[datasetName] = datasetID
      await datasetDao.createDataset(
        datasetPath,
        datasetID,
        datasetName,
        timeStamp,
      )
    }
    return result
  },

  createDatasetData: async (datasetID: string, dataIDList: string[]) => {
    const timeStamp = Date.now().toString()
    const promiseList = []
    for (const dataID of dataIDList) {
      promiseList.push(
        datasetDao.createDatasetData(datasetID, dataID, timeStamp),
      )
    }
    await Promise.all(promiseList)
  },
}
