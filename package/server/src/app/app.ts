import { datasetRoute } from '@/feature/dataset/dataset.route'
import { dataRoute } from '@/feature/model-data/data.route'
import { modelRoute } from '@/feature/model/model.route'
import { projectRoute } from '@/feature/project/project.route'
import { FastifyTypebox } from '@/type'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { fastify } from 'fastify'
import { globalErrorHandler } from './app.handler'
import { DATA_FOLDER_PATH } from '@/config/env'

const initializeFastifyPlugin = async (app: FastifyTypebox) => {
  // cors
  app.register(import('@fastify/cors'))
  // helmet
  app.register(import('@fastify/helmet'))
  // parse application/x-www-form-urlencoded
  app.register(import('@fastify/formbody'))
  // parse multipart/*
  app.register(import('@fastify/multipart'))
}

const initializeCustomPlugin = async (app: FastifyTypebox) => {
  // errorHandler
  app.register(globalErrorHandler)
}

const initializeRoutes = (app: FastifyTypebox) => {
  app.register(projectRoute, {
    prefix: '/api/v1/project',
  })
  app.register(datasetRoute, {
    prefix: '/api/v1/dataset',
  })
  app.register(dataRoute, {
    prefix: '/api/v1/data',
  })
  app.register(modelRoute, {
    prefix: '/api/v1/model',
  })
}

export const startApp = async (port: number) => {
  const app = fastify({
    logger: {
      level: 'info',
      file:
        process.env.NODE_ENV === 'dev'
          ? undefined
          : process.cwd() + '/log/info.txt',
    },
  }).withTypeProvider<TypeBoxTypeProvider>()

  initializeFastifyPlugin(app)
  initializeCustomPlugin(app)
  initializeRoutes(app)

  try {
    await app.listen({ port })
    console.log(process.cwd(), port, DATA_FOLDER_PATH, process.env.NODE_ENV)
  } catch (err) {
    app.log.error(err)
  }
}
