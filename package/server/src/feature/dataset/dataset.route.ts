import {
  DatasetActionBodySchema,
  DatasetActionResponseSchema,
  DatasetActionResponseType,
  DatasetListResponseSchema,
  DatasetListResponseType,
} from '@/feature/dataset/dataset.type'
import { FastifyTypebox } from '@/type/app.type'
import { generateResponse } from '@/util/app'
import { datasetService } from './dataset.service'

export const datasetRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/list',
    schema: {
      tags: ['dataset'],
      response: { 200: DatasetListResponseSchema },
    },
    handler: async (): Promise<DatasetListResponseType> => {
      const result = await datasetService.getDatasetList()
      const response = generateResponse(1, 'success', result)
      return response
    },
  })

  app.route({
    method: 'post',
    url: '/action',
    schema: {
      tags: ['dataset'],
      body: DatasetActionBodySchema,
      response: {
        200: DatasetActionResponseSchema,
      },
    },
    handler: async (req): Promise<DatasetActionResponseType> => {
      const body = req.body
      if (body.datasetAction === 'rename') {
        await datasetService.updateDatasetName(body.datasetID, body.datasetName)
      } else if (body.datasetAction === 'delete') {
        await datasetService.deleteDataset(body.datasetID)
      } else {
        // TODO create 等到写 model 在做
      }
      const response = generateResponse(1, 'success', null)
      return response
    },
  })
}
