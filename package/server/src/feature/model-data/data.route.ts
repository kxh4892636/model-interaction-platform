import { FastifyTypebox } from '@/type'
import { generateResponse } from '@/util/typebox'
import { dataService } from './data.service'
import {
  DataActionBodySchema,
  DataActionResponseSchema,
  DataActionResponseType,
  DataInfoQueryStringSchema,
  DataInfoResponseSchema,
  DataInfoResponseType,
  DataUploadResponseSchema,
  DataUploadResponseType,
  DataVisualizationQueryStringSchema,
} from './data.type'

export const dataRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/info',
    schema: {
      tags: ['data'],
      querystring: DataInfoQueryStringSchema,
      response: {
        200: DataInfoResponseSchema,
      },
    },
    handler: async (req): Promise<DataInfoResponseType> => {
      const queryString = req.query
      const result = await dataService.getDataInfo(queryString.dataID)
      const response = generateResponse('success', '', result)
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
    url: '/uvet/description',
    schema: {
      tags: ['data'],
      querystring: DataVisualizationQueryStringSchema,
      response: {
        200: {
          content: {
            'application/json': {
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
      return res.type('application/json').send(cs)
    },
  })

  app.route({
    method: 'get',
    url: '/uvet/image',
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
      return res.send(cs)
    },
  })

  app.route({
    method: 'get',
    url: '/json',
    schema: {
      tags: ['data'],
      querystring: DataVisualizationQueryStringSchema,
      response: {
        200: {
          content: {
            'application/json': {
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
      return res.type('application/json').send(cs)
    },
  })

  app.route({
    method: 'get',
    url: '/image',
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
      return res.send(cs)
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
    url: '/upload',
    schema: {
      tags: ['data'],
      response: {
        200: DataUploadResponseSchema,
      },
    },
    handler: async (req): Promise<DataUploadResponseType> => {
      // NOTE
      const options = { limits: { fileSize: 1073741824 } }
      const file = await req.file(options)
      if (!file) throw Error()
      await dataService.uploadData(file)
      return {
        status: 'success',
        data: null,
        message: '',
      }
    },
  })
  app.route({
    method: 'post',
    url: '/action',
    schema: {
      tags: ['data'],
      body: DataActionBodySchema,
      response: { 200: DataActionResponseSchema },
    },
    handler: async (req): Promise<DataActionResponseType> => {
      const body = req.body
      await dataService.deleteData(body.dataID)
      return {
        status: 'success',
        data: null,
        message: '',
      }
    },
  })
}
