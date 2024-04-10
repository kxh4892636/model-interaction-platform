import { orm } from '@/dao'
import { DBStatusType, WaterModelTypeType } from '@/type'
import { randomUUID } from 'crypto'

export const datasetDao = {
  createDataset: async (
    projectID: string,
    modelType: WaterModelTypeType,
    datasetType: string,
    datasetID: string,
    datasetName: string,
    datasetStatus: DBStatusType,
    identifier: string,
    datasetFolder: string,
  ) => {
    await orm.dataset.createDataset(
      datasetID,
      datasetName,
      identifier,
      datasetFolder,
      datasetType,
      modelType,
      datasetStatus,
    )
    await orm.projectDataset.createProjectDataset(
      randomUUID(),
      projectID,
      datasetID,
      'valid',
    )
  },

  deleteDataset: async (datasetID: string) => {
    await orm.dataset.deleteDatasetByDatasetID(datasetID)
    await orm.datasetData.deleteDatasetDataByDatasetID(datasetID).catch(() => {
      //
    })
    await orm.projectDataset
      .deleteProjectDatasetByDatasetID(datasetID)
      .catch(() => {
        //
      })
  },
}
