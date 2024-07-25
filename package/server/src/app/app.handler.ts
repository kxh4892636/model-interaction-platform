import { FastifyTypebox } from '@/type'
import { generateResponse } from '@/util/typebox'
import { Prisma } from '@prisma/client'
import fp from 'fastify-plugin'

export const globalErrorHandler = fp(async (app: FastifyTypebox) => {
  app.setErrorHandler((error, _, res) => {
    if (
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      res.code(200).send(generateResponse('error', 'db error', null))
    } else {
      res
        .code(200)
        .send(generateResponse('error', 'unhandler server error', null))
    }
    console.trace(error)
  })
})
