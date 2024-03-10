import { datasetRoute } from '@/feature/dataset/dataset.route'
import { dataRoute } from '@/feature/modal-data/data.route'
import { modelRoute } from '@/feature/model/model.route'
import { projectRoute } from '@/feature/project/project.route'
import { templateRoute } from '@/feature/template/template.route'
import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import helmet from '@fastify/helmet'
import multipart from '@fastify/multipart'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { fastify, FastifyInstance } from 'fastify'

const initializeMiddleware = async (app: FastifyInstance) => {
  // cors
  app.register(cors)
  // helmet
  app.register(helmet)
  // parse application/x-www-form-urlencoded
  app.register(formbody)
  // parse multipart/*
  app.register(multipart)
  // swagger
  await app.register(import('@fastify/swagger'), {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'openapi',
        version: '0.1.0',
      },
    },
  })
  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/api-doc',
  })
}

const initializeRoutes = (app: FastifyInstance) => {
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
  await initializeMiddleware(app)
  initializeRoutes(app)

  try {
    await app.listen({ port })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
