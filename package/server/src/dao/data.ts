import {
  DBStatusType,
  WaterDataStyleType,
  WaterDataTypeType,
  WaterModelTypeType,
} from '@/type'
import { prisma } from '@/util/db/prisma'

export const dataDao = {
  createData: async (
    dataID: string,
    dataName: string,
    dataType: WaterDataTypeType,
    dataStyle: WaterDataStyleType,
    dataExtent: number[],
    dataIdentifier: string,
    dataFilePath: string,
    modelType: WaterModelTypeType,
    dataVisualization: string[],
    status: DBStatusType,
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.data.create({
      data: {
        create_time: timeStamp,
        data_file_path: dataFilePath,
        data_id: dataID,
        data_identifier: dataIdentifier,
        data_name: dataName,
        data_style: dataStyle,
        data_type: dataType,
        model_type: modelType,
        status,
        update_time: timeStamp,
        data_extent: dataExtent,
        data_visualization: dataVisualization,
      },
    })
  },

  updateDataByDataID: async (
    dataID: string,
    init: {
      dataName?: string
      dataType?: WaterDataTypeType
      dataStyle?: WaterDataStyleType
      dataExtent?: number[]
      dataIdentifier?: string
      dataFilePath?: string
      modelType?: WaterModelTypeType
      dataVisualization?: string[]
      status?: DBStatusType
    },
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.data.update({
      where: {
        data_id: dataID,
      },
      data: {
        data_file_path: init.dataFilePath,
        data_identifier: init.dataIdentifier,
        data_name: init.dataName,
        data_style: init.dataStyle,
        data_type: init.dataType,
        model_type: init.modelType,
        status: init.status,
        update_time: timeStamp,
        data_extent: init.dataExtent,
        data_visualization: init.dataVisualization,
      },
    })
  },

  getDataByDataID: async (dataID: string) => {
    const result = await prisma.data.findUnique({
      where: {
        data_id: dataID,
      },
    })

    return result
  },

  deleteDataByDataID: async (dataID: string) => {
    await prisma.data.delete({
      where: {
        data_id: dataID,
      },
    })
  },
}
