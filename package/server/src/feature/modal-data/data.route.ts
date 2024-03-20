import {
  DataActionBodySchema,
  DataActionResponseSchema,
  DataActionResponseType,
  DataInfoParamsSchema,
  DataInfoResponseSchema,
  DataInfoResponseType,
  DataVisualizationQueryStringSchema,
} from '@/feature/modal-data/data.type'
import { FastifyTypebox } from '@/type/app.type'
import { generateResponse } from '@/util/app'
import { dataService } from './data.service'

export const dataRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/info/:dataID',
    schema: {
      tags: ['data'],
      params: DataInfoParamsSchema,
      response: {
        200: DataInfoResponseSchema,
      },
    },
    handler: async (req): Promise<DataInfoResponseType> => {
      const params = req.params
      const result = await dataService.getDataInfo(params.dataID)
      const response = generateResponse(1, 'success', result)
      return response
    },
  })

  app.route({
    method: 'get',
    url: '/mesh',
    schema: {
      tags: ['data'],
      querystring: DataVisualizationQueryStringSchema,
      response: {
        200: {
          content: {
            'image/png': {
              schema: {},
            },
          },
        },
      },
    },
    handler: async (req, res) => {
      const query = req.query
      const cs = await dataService.getDataVisualizationData(
        query.dataID,
        query.index,
      )
      if (!cs) throw Error()
      return res.type('image/png').send(cs)
    },
  })

  app.route({
    method: 'get',
    url: '/text',
    schema: {
      tags: ['data'],
      querystring: DataVisualizationQueryStringSchema,
      response: {
        200: {
          content: {
            'text/plain': {
              schema: {},
            },
          },
        },
      },
    },
    handler: async (req, res) => {
      const query = req.query
      const cs = await dataService.getDataVisualizationData(
        query.dataID,
        query.index,
      )
      if (!cs) throw Error()
      return res.type('text/plain').send(cs)
    },
  })

  app.route({
    method: 'post',
    url: '/action',
    schema: {
      tags: ['project'],
      body: DataActionBodySchema,
      response: { 200: DataActionResponseSchema },
    },
    handler: async (req): Promise<DataActionResponseType> => {
      const body = req.body
      if (body.action === 'rename') {
        await dataService.updateDataName(body.dataID, body.dataName)
      }
      const response = generateResponse(1, 'success', null)
      return response
    },
  })
}
