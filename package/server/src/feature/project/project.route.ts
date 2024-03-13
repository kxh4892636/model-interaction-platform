import {
  ProjectActionBodySchema,
  ProjectActionResponseSchema,
  ProjectListResponseSchema,
  ProjectListResponseType,
  ProjectParamsSchema,
  ProjectParamsType,
  ProjectResponseSchema,
  ProjectResponseType,
} from '@/type/project.type'
import { checkTypeBoxSchema, generateResponse } from '@/util/app'
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
    preHandler: async (req, res) => {
      const params = req.params as ProjectParamsType
      const result = checkTypeBoxSchema(ProjectParamsSchema, params)
      if (!result) {
        return res
          .code(500)
          .send(
            generateResponse(0, 'the params of this request is wrong', null),
          )
      }
    },
    handler: async (req, res) => {
      try {
        const { projectID } = req.params as ProjectParamsType
        const result = await projectService.getProjectByProjectID(projectID)
        const response: ProjectResponseType = generateResponse(1, '', result)
        return res.code(200).send(response)
      } catch (error) {
        return res.code(500).send(generateResponse(0, '', null))
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
    handler: async (_, res) => {
      try {
        const result = await projectService.getAllProject()
        const response: ProjectListResponseType = generateResponse(
          1,
          '',
          result,
        )
        return res.code(200).send(response)
      } catch (error) {
        return res.code(500).send(generateResponse(0, '', null))
      }
    },
  })

  // TODO tree 写完 data 在做
  // app.route({
  //   method: 'post',
  //   url: '/tree',
  //   schema: {
  //     tags: ['project'],
  //     body: ProjectActionBodySchema,
  //     response: { 200: ProjectActionResponseSchema },
  //   },
  //   handler: async () => {
  //     return 'Hello World!'
  //   },
  // })

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
