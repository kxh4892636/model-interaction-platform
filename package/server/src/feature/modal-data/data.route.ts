import {
  DataActionBodySchema,
  DataActionBodyType,
  DataActionResponseSchema,
  DataActionResponseType,
  DataInfoParamsSchema,
  DataInfoParamsType,
  DataInfoResponseSchema,
  DataInfoResponseType,
  DataVisualizationQueryStringSchema,
  DataVisualizationQueryStringType,
} from '@/type/data.type'
import { checkTypeBoxSchema, generateResponse } from '@/util/app'
import { FastifyInstance } from 'fastify'
import { dataService } from './data.service'

export const dataRoute = async (app: FastifyInstance) => {
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
    preHandler: async (req, res) => {
      const params = req.params
      const result = checkTypeBoxSchema(DataInfoParamsSchema, params)
      if (!result)
        res
          .code(500)
          .send(
            generateResponse(0, 'the params of this request is wrong', null),
          )
    },
    handler: async (req, res) => {
      try {
        const params = req.params as DataInfoParamsType
        const result = await dataService.getDataInfo(params.dataID)
        const response: DataInfoResponseType = generateResponse(1, '', result)
        return response
      } catch (error) {
        res.code(500).send(generateResponse(0, 'error', null))
      }
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
    preHandler: async (req, res) => {
      const query = req.query
      const result = checkTypeBoxSchema(
        DataVisualizationQueryStringSchema,
        query,
      )
      if (!result)
        res
          .code(500)
          .send(
            generateResponse(0, 'the params of this request is wrong', null),
          )
    },
    handler: async (req, res) => {
      try {
        const query = req.query as DataVisualizationQueryStringType
        const cs = await dataService.getDataVisualizationData(
          query.dataID,
          query.index,
        )
        if (!cs) throw Error()
        return res.type('image/png').send(cs)
      } catch (error) {
        return res.code(500).send(generateResponse(0, 'error', null))
      }
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
    preHandler: async (req, res) => {
      const query = req.query
      const result = checkTypeBoxSchema(
        DataVisualizationQueryStringSchema,
        query,
      )
      if (!result)
        res
          .code(500)
          .send(
            generateResponse(0, 'the params of this request is wrong', null),
          )
    },
    handler: async (req, res) => {
      try {
        const query = req.query as DataVisualizationQueryStringType
        const cs = await dataService.getDataVisualizationData(
          query.dataID,
          query.index,
        )
        if (!cs) throw Error()
        return res.type('text/plain').send(cs)
      } catch (error) {
        return res.code(500).send(generateResponse(0, 'error', null))
      }
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
    preHandler: async (req, res) => {
      const body = req.body
      const result = checkTypeBoxSchema(DataActionBodySchema, body)
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
        const body = req.body as DataActionBodyType
        if (body.action === 'rename') {
          await dataService.updateDataName(body.dataID, body.dataName)
        }
        const response: DataActionResponseType = generateResponse(1, '', null)
        return response
      } catch (error) {
        return res.code(500).send(generateResponse(0, 'error', null))
      }
    },
  })
}
