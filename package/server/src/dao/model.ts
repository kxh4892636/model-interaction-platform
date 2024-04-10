import { DBStatusType } from '@/type'
import { prisma } from '@/util/db/prisma'

export const modelDao = {
  createModel: async (
    modelID: string,
    modelDatasetID: string,
    modelPid: number,
    modelProgress: number,
    status: DBStatusType,
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.model.create({
      data: {
        create_time: timeStamp,
        model_dataset_id: modelDatasetID,
        model_id: modelID,
        model_pid: modelPid,
        model_progress: modelProgress,
        status,
        update_time: timeStamp,
      },
    })
  },

  getModelByModelID: async (modelID: string) => {
    const result = await prisma.model.findUnique({
      where: {
        model_id: modelID,
      },
    })

    return result
  },

  updateModelByModelID: async (
    modelID: string,
    init: {
      modelDatasetID?: string
      modelPid?: number
      modelProgress?: number
      status?: DBStatusType
    },
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.model.update({
      where: {
        model_id: modelID,
      },
      data: {
        model_dataset_id: init.modelDatasetID,
        model_pid: init.modelPid,
        model_progress: init.modelProgress,
        status: init.status,
        update_time: timeStamp,
      },
    })
  },

  deleteModelByModelID: async (modelID: string) => {
    await prisma.model.delete({
      where: {
        model_id: modelID,
      },
    })
  },
}
