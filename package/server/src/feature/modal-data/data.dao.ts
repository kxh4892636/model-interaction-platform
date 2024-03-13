import { prisma } from '@/util/db/prisma'

export const dataDao = {
  createData: async (
    dataFilePath: string,
    dataName: string,
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
        data_input: true,
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
}
