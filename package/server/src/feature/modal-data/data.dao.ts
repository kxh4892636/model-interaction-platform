import { prisma } from '@/util/db/prisma'

export const dataDao = {
  createData: async (
    dataFilePath: string,
    dataName: string,
    input: boolean,
    dataID: string,
    style: string,
    type: string,
    extent: number[],
    visualization: string[],
    timeStamp: string,
  ) => {
    await prisma.data.create({
      data: {
        data_file_path: dataFilePath,
        data_id: dataID,
        data_input: input,
        data_name: dataName,
        data_style: style,
        data_timestamp: timeStamp,
        data_type: type,
        data_extent: extent,
        data_visualization: visualization,
        status: 'active',
        create_time: timeStamp,
        update_time: timeStamp,
      },
    })
  },

  getDataInfo: async (dataID: string) => {
    const result = await prisma.data.findUnique({
      where: {
        data_id: dataID,
      },
      select: {
        data_extent: true,
        data_file_path: true,
        data_id: true,
        data_input: true,
        data_name: true,
        data_style: true,
        data_timestamp: true,
        data_type: true,
        data_visualization: true,
      },
    })

    return result
  },

  updateDataName: async (dataID: string, dataName: string) => {
    const timeStamp = Date.now().toString()
    await prisma.data.update({
      where: {
        data_id: dataID,
      },
      data: {
        data_name: dataName,
        update_time: timeStamp,
      },
    })
  },

  // updateData:async()=>{
  //   const timeStamp = Date.now().toString()
  //   await prisma.data.update({
  //     where: {
  //       data_id: dataID,
  //     },
  //     data: {
  //       data_name: dataName,
  //       update_time: timeStamp,
  //     },
  //   })
  // }

  deleteData: async (dataID: string) => {
    await prisma.data.delete({
      where: {
        data_id: dataID,
      },
    })
  },
}
