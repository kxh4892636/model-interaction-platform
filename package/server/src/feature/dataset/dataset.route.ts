import {
  DatasetActionBodySchema,
  DatasetActionBodyType,
  DatasetActionResponseSchema,
  DatasetActionResponseType,
  DatasetListResponseSchema,
  DatasetListResponseType,
} from '@/type/dataset.type'
import { checkTypeBoxSchema, generateResponse } from '@/util/app'
import { FastifyInstance } from 'fastify'
import { datasetService } from './dataset.service'

export const datasetRoute = async (app: FastifyInstance) => {
  app.route({
    method: 'get',
    url: '/list',
    schema: {
      tags: ['dataset'],
      response: { 200: DatasetListResponseSchema },
    },
    handler: async (_, res) => {
      try {
        const result = await datasetService.getDatasetList()
        const response: DatasetListResponseType = generateResponse(
          1,
          '',
          result,
        )
        return response
      } catch (error) {
        return res.code(500).send(generateResponse(0, 'error', null))
      }
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
    preHandler: async (req, res) => {
      const body = req.body
      const result = checkTypeBoxSchema(DatasetActionBodySchema, body)
      if (!result) {
        return res
          .code(500)
          .send(
            generateResponse(0, 'the params of this request is wrong', null),
          )
      }
    },
    handler: async (req, res) => {
      try {
        const body = req.body as DatasetActionBodyType
        if (body.datasetAction === 'rename') {
          await datasetService.updateDatasetName(
            body.datasetID,
            body.datasetName,
          )
        } else if (body.datasetAction === 'delete') {
          await datasetService.deleteDataset(body.datasetID)
        } else {
          // TODO create 等到写 model 在做
        }
        const response: DatasetActionResponseType = generateResponse(
          1,
          '',
          null,
        )
        return response
      } catch (error) {
        return res.code(500).send(generateResponse(0, 'error', null))
      }
    },
  })
}
