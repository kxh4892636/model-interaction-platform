import { FastifyTypebox } from '@/type/app.type'

export const modelRoute = async (app: FastifyTypebox) => {
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
