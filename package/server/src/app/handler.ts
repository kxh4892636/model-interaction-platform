import { FastifyTypebox } from '@/type/app.type'
import { generateResponse } from '@/util/app'
import fp from 'fastify-plugin'

export const globalErrorHandler = fp(async (app: FastifyTypebox) => {
  app.setErrorHandler((error, _, res) => {
    if (error) {
      res.code(500).send(generateResponse(0, 'error', null))
    }
  })
})
