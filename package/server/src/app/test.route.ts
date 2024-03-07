import { FastifyInstance } from 'fastify'

export const testRoutes = async (app: FastifyInstance) => {
  app.route({
    method: 'get',
    url: '/test',
    handler: async () => {
      return 'Hello World!'
    },
  })
}
