import { FastifyInstance } from 'fastify'

export const modelRoute = async (app: FastifyInstance) => {
  app.route({
    method: 'get',
    url: '/water',
    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/sand',
    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'get',
    url: '/quality',
    handler: async () => {
      return 'Hello World!'
    },
  })
}
