import { FastifyTypebox } from '@/type'
import { generateResponse } from '@/util/typebox'
import { datasetService } from './dataset.service'
import {
  DatasetActionBodySchema,
  DatasetActionResponseSchema,
  DatasetActionResponseType,
} from './dataset.type'

export const datasetRoute = async (app: FastifyTypebox) => {
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
      if (body.datasetAction === 'delete') {
        await datasetService.deleteDataset(body.datasetID, true)
      }
      const response = generateResponse('success', '', null)
      return response
    },
  })
}
