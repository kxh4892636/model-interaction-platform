import { FastifyTypebox } from '@/type/app.type'
import { generateResponse } from '@/util/app'
import { randomUUID } from 'crypto'
import { modelService } from './model.service'
import {
  ModelActionBodySchema,
  ModelActionResponseSchema,
  ModelActionResponseType,
  ModelInfoParamsSchema,
  ModelInfoResponseSchema,
  ModelInfoResponseType,
} from './model.type'

export const modelRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/info/:modelID',
    schema: {
      tags: ['model'],
      params: ModelInfoParamsSchema,
      response: {
        200: ModelInfoResponseSchema,
      },
    },
    handler: async (req): Promise<ModelInfoResponseType> => {
      const params = req.params
      const result = await modelService.getModelInfo(params.modelID)
      const response = generateResponse(1, 'success', result)
      return response
    },
  })

  app.route({
    method: 'post',
    url: '/action',
    schema: {
      body: ModelActionBodySchema,
      response: {
        200: ModelActionResponseSchema,
      },
    },
    handler: async (req): Promise<ModelActionResponseType> => {
      const body = req.body
      const modelID = body.modelID
      const action = body.action
      const init = body.modelInit
      if (action === 'run') {
        if (!init) throw Error()
        const modelID = randomUUID()
        modelService.runModel(
          init.modelType,
          init.modelName,
          init.projectID,
          modelID,
          init.paramsID,
          init.hours,
          init.uvetID,
        )
        const response = generateResponse(1, '', modelID)
        return response
      } else {
        if (!modelID) throw Error()
        modelService.stopModal(modelID)
        const response = generateResponse(1, '', null)
        return response
      }
    },
  })
}
