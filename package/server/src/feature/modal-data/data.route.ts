import { FastifyInstance } from 'fastify'
import { dataActionSchema, dataDetailSchema, dataSchema } from './data.schema'

export const dataRoute = async (app: FastifyInstance) => {
  app.route({
    method: 'get',
    url: '/text/:dataID',
    schema: dataSchema,
    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/json/:dataID',
    schema: dataSchema,
    handler: async () => {
      return 'Hello World!'
    },
  })

  // NOTE 前端接收图片使用 blob
  // NOTE fastify swagger 写法
  app.route({
    method: 'get',
    url: '/blob/:dataID',
    schema: dataSchema,
    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/detail/:dataID',
    schema: dataDetailSchema,
    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'post',
    url: '/action',
    schema: dataActionSchema,
    handler: async () => {
      return 'Hello World!'
    },
  })
}
