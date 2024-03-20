import { datasetRoute } from '@/feature/dataset/dataset.route'
import { dataRoute } from '@/feature/modal-data/data.route'
import { modelRoute } from '@/feature/model/model.route'
import { projectRoute } from '@/feature/project/project.route'
import { templateRoute } from '@/feature/template/template.route'
import { FastifyTypebox } from '@/type/app.type'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { fastify } from 'fastify'
import { globalErrorHandler } from './handler'

const initializeFastifyPlugin = async (app: FastifyTypebox) => {
  // cors
  app.register(import('@fastify/cors'))
  // helmet
  app.register(import('@fastify/helmet'))
  // parse application/x-www-form-urlencoded
  app.register(import('@fastify/formbody'))
  // parse multipart/*
  app.register(import('@fastify/multipart'))
  // swagger
  app.register(import('@fastify/swagger'), {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'openapi',
        version: '0.1.0',
      },
    },
  })
  app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/api-doc',
  })
}

const initializeCustomPlugin = async (app: FastifyTypebox) => {
  // errorHandler
  // TODO setErrorHanler 和封装
  app.register(globalErrorHandler)
}

const initializeRoutes = (app: FastifyTypebox) => {
  app.register(templateRoute, {
    prefix: '/api/v1/template',
  })
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
        process.env.NODE_ENV === 'production'
          ? process.cwd() + '/log/info.txt'
          : undefined,
    },
  }).withTypeProvider<TypeBoxTypeProvider>()

  initializeFastifyPlugin(app)
  initializeCustomPlugin(app)
  initializeRoutes(app)

  try {
    await app.listen({ port })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
