import { DATA_FOLDER_PATH } from '@/config/env'
import { DataInfoType } from '@/type/data.type'
import { prisma } from '@/util/db/prisma'
import { getModelDataTypeAndStyle } from '@/util/water'
import { getModelDataExtentAndVisualization } from '@/util/water/getModelDataTypeAndStyle'
import { randomUUID } from 'crypto'
import { createReadStream } from 'fs'
import path from 'path'
import { dataDao } from './data.dao'

export const dataService = {
  createData: async (
    projectPath: string,
    projectTree: Record<string, string[]>,
    datasetIDMap: Record<string, string>,
  ) => {
    const result: Record<string, string[]> = {}
    const timeStamp = Date.now().toString()
    const datasetNameList = Object.keys(projectTree)
    for (const datasetName of datasetNameList) {
      const datasetID = datasetIDMap[datasetName]
      result[datasetID] = []
      const dataNameList = projectTree[datasetName]
      for (const dataName of dataNameList) {
        const dataPath = path.join(projectPath, datasetName, 'input', dataName)
        const extname = path.extname(dataName)
        const [type, style] = getModelDataTypeAndStyle(dataName, extname)
        const [extent, visualization] = getModelDataExtentAndVisualization(
          dataName,
          extname,
        )
        const visualizationPathList = visualization.map((fileName) =>
          path.join(projectPath, datasetName, 'output', fileName),
        )

        // import dataset
        const uuid = randomUUID()
        result[datasetID].push(uuid)
        await dataDao.createData(
          dataPath,
          dataName,
          uuid,
          style,
          type,
          extent,
          visualizationPathList,
          timeStamp,
        )
      }
    }

    return result
  },

  getDataInfo: async (dataID: string) => {
    const dataInfo = await dataDao.getDataInfo(dataID)
    if (!dataInfo) return null
    const result: DataInfoType = {
      dataExtent: dataInfo.data_extent,
      dataID: dataInfo.data_id,
      dataName: dataInfo.data_name,
      dataStyle: dataInfo.data_style,
      dataType: dataInfo.data_type,
      isInput: dataInfo.data_input,
      visualizationNumber: dataInfo.data_visualization.length,
    }
    return result
  },

  getDataVisualizationData: async (dataID: string, index: number) => {
    const dataInfo = await prisma.data.findUnique({
      where: {
        data_id: dataID,
      },
      select: {
        data_file_path: true,
        data_type: true,
        data_visualization: true,
      },
    })
    if (!dataInfo) return null

    const length = dataInfo.data_visualization.length
    if (length !== 0 && (index > length || index < 0)) return null

    const relativePath =
      length === 0
        ? dataInfo.data_file_path
        : dataInfo.data_visualization[index]
    const filePath = path.join(DATA_FOLDER_PATH, relativePath)
    const cs = createReadStream(filePath)

    return cs
  },

  updateDataName: async (dataID: string, dataName: string) => {
    await dataDao.updateDataName(dataID, dataName)
  },
}
