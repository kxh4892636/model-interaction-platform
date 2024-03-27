import { prisma } from '@/util/db/prisma'

export const modelDao = {
  getMeshInfo: async (meshFilePath: string) => {
    const result = await prisma.data.findFirst({
      where: {
        data_file_path: meshFilePath,
      },
    })
    return result
  },
}
