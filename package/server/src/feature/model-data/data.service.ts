/* eslint-disable @typescript-eslint/no-explicit-any */
import { MODEL_TYPE_LIST } from '@/config/constant'
import { DATA_FOLDER_PATH } from '@/config/env'
import { orm } from '@/dao'
import { DataInfoType } from '@/feature/model-data/data.type'
import { WaterModelTypeType } from '@/type'
import { prisma } from '@/util/db/prisma'
import {
  getModelDataExtentAndVisualization,
  getModelDataTypeAndStyle,
} from '@/util/water'
import { MultipartFile } from '@fastify/multipart'
import { randomUUID } from 'crypto'
import { createReadStream, createWriteStream } from 'fs'
import { rm } from 'fs/promises'
import path from 'path'
import { pipeline } from 'stream/promises'
import { dataDao } from './data.dao'

export const dataService = {
  isUpload: async (filePath: string) => {
    const info = await prisma.data.findFirst({
      where: {
        data_file_path: filePath,
      },
    })
    if (info) {
      return info.data_id
    } else {
      return null
    }
  },

  uploadData: async (file: MultipartFile) => {
    const datasetTypeField = file.fields.datasetType as any
    const modelTypeField = file.fields.modelType as any
    const projectIDField = file.fields.projectID as any
    if (!modelTypeField || !projectIDField) throw Error()
    const datasetType = datasetTypeField.value as WaterModelTypeType
    const modelType = modelTypeField.value as WaterModelTypeType
    const projectID = projectIDField.value as string
    console.log(modelType)

    // validate
    const projectInfo = await orm.project.getProjectByProjectID(projectID)
    if (!projectInfo) throw Error()
    if (!MODEL_TYPE_LIST.includes(modelType)) throw Error()
    const datasetID = await dataDao.getDatasetOfUpload(
      projectInfo.project_identifier,
      datasetType,
      modelType,
    )

    if (!datasetID) throw Error()
    if (datasetID.status === 'expire') {
      orm.dataset.updateDatasetByDatasetID(datasetID.dataset_id, {
        status: 'valid',
      })
    }

    // copy file
    const filePath = (() => {
      if (modelType !== 'water-3d') {
        return path.join(
          projectInfo.project_folder_path,
          modelType,
          file.filename,
        )
      } else {
        return path.join(
          projectInfo.project_folder_path,
          modelType,
          'inputfile',
          file.filename,
        )
      }
    })()
    await pipeline(
      file.file,
      createWriteStream(path.join(DATA_FOLDER_PATH, filePath)),
    )
    const [dataType, dataStyle] = getModelDataTypeAndStyle(filePath)
    const [dataExtent, dataVisualization] =
      await getModelDataExtentAndVisualization(filePath)
    const dataID = await dataService.isUpload(filePath)
    if (!dataID) {
      // create db record
      await dataDao.createData(
        datasetID.dataset_id,
        randomUUID(),
        file.filename,
        dataType,
        dataStyle,
        dataExtent,
        projectInfo.project_identifier,
        filePath,
        modelType,
        dataVisualization,
        'valid',
      )
    } else {
      // update db record
      orm.data.updateDataByDataID(dataID, {
        dataName: file.filename,
        dataType,
        dataStyle,
        dataExtent,
        dataVisualization,
      })
    }
  },

  getDataInfo: async (dataID: string) => {
    const dataInfo = await orm.data.getDataByDataID(dataID)
    if (!dataInfo) throw Error()
    const result: DataInfoType = {
      dataExtent: dataInfo.data_extent,
      dataID: dataInfo.data_id,
      dataName: dataInfo.data_name,
      dataStyle: dataInfo.data_style as any,
      dataType: dataInfo.data_type as any,
      visualizationNumber: dataInfo.data_visualization.length,
      modelType: dataInfo.model_type as any,
      status: dataInfo.status,
    }
    return result
  },

  deleteData: async (dataID: string) => {
    const dataInfo = await orm.data.getDataByDataID(dataID)
    if (!dataInfo) throw Error()
    // delete db record
    await dataDao.deleteData(dataID)
    // delete disk data
    const filePathList = [
      dataInfo.data_file_path,
      ...dataInfo.data_visualization,
    ]
    const promiseList = filePathList.map(async (filePath) => {
      await rm(path.join(DATA_FOLDER_PATH, filePath))
    })
    await Promise.all(promiseList)
  },

  getDataVisualizationData: async (dataID: string, index: number) => {
    const dataInfo = await orm.data.getDataByDataID(dataID)
    if (!dataInfo) return null

    const length = dataInfo.data_visualization.length
    if (length !== 0 && (index >= length || index < 0)) return null

    const relativePath =
      length === 0
        ? dataInfo.data_file_path
        : dataInfo.data_visualization[index]
    const filePath = path.join(DATA_FOLDER_PATH, relativePath)
    const cs = createReadStream(filePath)

    return cs
  },
}
