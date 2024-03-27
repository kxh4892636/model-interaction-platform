import { orm } from '@/dao'
import { DBStatusType, WaterModelTypeType } from '@/type'
import path from 'path'
import { dataService } from '../model-data/data.service'
import { datasetDao } from './dataset.dao'

export const datasetService = {
  createDataset: async (
    projectID: string,
    modelType: WaterModelTypeType,
    datasetType: string,
    datasetID: string,
    datasetName: string,
    datasetStatus: DBStatusType,
  ) => {
    const projectInfo = await orm.project.getProjectByProjectID(projectID)
    if (!projectInfo) throw Error()
    const datasetFolder = path.join(projectInfo.project_folder_path, modelType)
    const identifier = projectInfo.project_identifier
    await datasetDao.createDataset(
      projectID,
      modelType,
      datasetType,
      datasetID,
      datasetName,
      datasetStatus,
      identifier,
      datasetFolder,
    )
  },
  //   createDatasetData: async (datasetID: string, dataIDList: string[]) => {
  //     const timeStamp = Date.now().toString()
  //     const promiseList = []
  //     for (const dataID of dataIDList) {
  //       promiseList.push(
  //         datasetDao.createDatasetData(datasetID, dataID, timeStamp),
  //       )
  //     }
  //     await Promise.all(promiseList)
  //   },
  //   getDatasetList: async (): Promise<DatasetListType> => {
  //     const datasetList = await datasetDao.getDatasetList()
  //     const promiseList = datasetList.map(async (datasetInfo) => {
  //       const dataIDList = await datasetDao.getDataIDListOfDataset(
  //         datasetInfo.dataset_id,
  //       )
  //       const result = {
  //         datasetID: datasetInfo.dataset_id,
  //         datasetName: datasetInfo.dataset_name,
  //         isInput: datasetInfo.dataset_input,
  //         dataIDList,
  //       }
  //       return result
  //     })
  //     const result: DatasetListType = await Promise.all(promiseList)
  //     return result
  //   },
  //   updateDatasetName: async (datasetID: string, datasetName: string) => {
  //     await datasetDao.updateDatasetName(datasetID, datasetName)
  //   },
  deleteDataset: async (datasetID: string, logical: boolean) => {
    const datasetInfo = await orm.dataset.getDatasetByDatasetID(datasetID)
    if (!datasetInfo) throw Error()
    const dataIDList = await orm.datasetData.getDataIDListByDatasetID(datasetID)

    // delete db record
    if (datasetInfo.dataset_type.includes('-input') && logical) {
      // if dataset is input, transform its status to expire
      // because of the question of data upload
      await orm.dataset.updateDatasetByDatasetID(datasetID, {
        status: 'expire',
      })
    } else {
      await datasetDao.deleteDataset(datasetID)
    }

    // delete data of dataset
    for (const dataID of dataIDList) {
      dataService.deleteData(dataID.data_id)
    }
  },
}
