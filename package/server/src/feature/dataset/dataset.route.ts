import {
  DatasetActionResponseSchema,
  DatasetListResponseSchema,
} from '@/type/dataset.type'
import { FastifyInstance } from 'fastify'

export const datasetRoute = async (app: FastifyInstance) => {
  app.route({
    method: 'get',
    url: '/list',
    schema: {
      response: { 200: DatasetListResponseSchema },
    },
    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'post',
    url: '/action',
    schema: {
      response: {
        200: DatasetActionResponseSchema,
      },
    },
    handler: async () => {
      return 'Hello World!'
    },
  })
}
