import {
  DataInfoParamsSchema,
  DataInfoParamsType,
  DataInfoResponseSchema,
  DataInfoResponseType,
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
          .send(500)
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
        res.send(500).send(generateResponse(0, '', null))
      }
    },
  })

  // NOTE 前端接收图片使用 blob
  // NOTE fastify swagger 写法
  app.route({
    method: 'get',
    url: '/mesh/:dataID',

    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/text/:dataID',

    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/geojson/:dataID',

    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/uvet/:dataID',

    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/tcd/:dataID',

    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/tnd/:dataID',

    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/snd/:dataID',

    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/yuji/:dataID',

    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'post',
    url: '/action',
    handler: async () => {
      return 'Hello World!'
    },
  })
}
