import { DATA_FOLDER_PATH } from '@/config/env'
import { DatasetListType } from '@/feature/dataset/dataset.type'
import { copyFolder } from '@/util/fs'
import { randomUUID } from 'crypto'
import { mkdir, rm } from 'fs/promises'
import path from 'path'
import { dataDao } from '../modal-data/data.dao'
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

  getDatasetList: async (): Promise<DatasetListType> => {
    const datasetList = await datasetDao.getDatasetList()
    const promiseList = datasetList.map(async (datasetInfo) => {
      const dataIDList = await datasetDao.getDataIDListOfDataset(
        datasetInfo.dataset_id,
      )
      const result = {
        datasetID: datasetInfo.dataset_id,
        datasetName: datasetInfo.dataset_name,
        isInput: datasetInfo.dataset_input,
        dataIDList,
      }
      return result
    })
    const result: DatasetListType = await Promise.all(promiseList)
    return result
  },

  updateDatasetName: async (datasetID: string, datasetName: string) => {
    await datasetDao.updateDatasetName(datasetID, datasetName)
  },

  deleteDataset: async (datasetID: string) => {
    const datasetInfo = await datasetDao.getDatasetInfo(datasetID)
    if (!datasetInfo) return
    const dataIDList = await datasetDao.getDataIDListOfDataset(datasetID)

    // delete db record
    await datasetDao.deleteProjectDataset(datasetID)
    await datasetDao.deleteDataset(datasetID)
    await datasetDao.deleteDatasetData(datasetID)
    for (const dataID of dataIDList) {
      await dataDao.deleteData(dataID)
    }

    // delete disk data
    const folderPath = path.join(
      DATA_FOLDER_PATH,
      datasetInfo.dataset_folder_path,
    )
    await rm(folderPath, {
      recursive: true,
    })
  },
}
