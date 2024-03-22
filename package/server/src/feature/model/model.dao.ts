import { prisma } from '@/util/db/prisma'

export const modelDao = {
  createModel: async (
    modelID: string,
    timeStamp: string,
    datasetID: string,
  ) => {
    await prisma.model.create({
      data: {
        create_time: timeStamp,
        model_id: modelID,
        // 0 running
        // 1 finished
        // -1 failed
        model_progress: 0,
        status: 'active',
        update_time: timeStamp,
        model_dataset_id: datasetID,
        model_status: 1,
        model_pid: [],
      },
    })
  },

  getModal: async (modelID: string) => {
    const modelInfo = await prisma.model.findUnique({
      where: { model_id: modelID },
    })

    return modelInfo
  },

  updateModel: async (
    modelID: string,
    updateValue: {
      modelProgress?: number
      status?: string
      modelStatus?: number
      pids?: number[]
    },
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.model.update({
      where: {
        model_id: modelID,
      },
      data: {
        model_progress: updateValue.modelProgress,
        status: updateValue.status,
        update_time: timeStamp,
        model_status: updateValue.modelStatus,
        model_pid: updateValue.pids,
      },
    })
  },

  deleteModal: async (modelID: string) => {
    await prisma.model.delete({
      where: {
        model_id: modelID,
      },
    })
  },
}
