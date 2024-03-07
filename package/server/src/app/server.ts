import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import helmet from '@fastify/helmet'
import multipart from '@fastify/multipart'
import { fastify, FastifyInstance } from 'fastify'
import { testRoutes } from './test.route'

const initializeMiddleware = (app: FastifyInstance) => {
  // cors
  app.register(cors)
  // helmet
  app.register(helmet)
  // parse application/x-www-form-urlencoded
  app.register(formbody)
  // parse multipart/*
  app.register(multipart)
}

const initializeRoutes = (app: FastifyInstance) => {
  app.register(testRoutes)
}

export const startApp = async (port: number) => {
  const app = fastify({
    logger: {
      level: 'info',
      file:
        process.env.NODE_ENV === 'production'
          ? process.cwd() + '/log/info.txt'
          : undefined,
    },
  })
  initializeMiddleware(app)
  initializeRoutes(app)

  try {
    await app.listen({ port })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
