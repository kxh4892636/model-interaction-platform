import {
  ProjectActionBodySchema,
  ProjectActionResponseSchema,
  ProjectListResponseSchema,
  ProjectParamsSchema,
  ProjectParamsType,
  ProjectResponseSchema,
} from '@/type/project.type'
import { FastifyInstance } from 'fastify'
import { projectService } from './project.service'

export const projectRoute = async (app: FastifyInstance) => {
  app.route({
    method: 'get',
    url: '/detail/:projectID',
    schema: {
      tags: ['project'],
      params: ProjectParamsSchema,
      response: { 200: ProjectResponseSchema },
    },
    handler: async (req, res) => {
      try {
        const { projectID } = req.params as ProjectParamsType
        const result = await projectService.getProjectByProjectID(projectID)
        return res.code(200).send({
          code: 0,
          message: '',
          data: result,
        })
      } catch (error) {
        return res.code(500).send({
          code: 0,
          message: '',
          data: null,
        })
      }
    },
  })

  app.route({
    method: 'get',
    url: '/list',
    schema: {
      tags: ['project'],
      response: { 200: ProjectListResponseSchema },
    },
    handler: async () => {
      return 'Hello World!'
    },
  })

  app.route({
    method: 'post',
    url: '/action',
    schema: {
      tags: ['project'],
      body: ProjectActionBodySchema,
      response: { 200: ProjectActionResponseSchema },
    },
    handler: async () => {
      return 'Hello World!'
    },
  })
}
