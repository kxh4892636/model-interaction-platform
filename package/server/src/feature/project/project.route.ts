import {
  ProjectActionBodySchema,
  ProjectActionBodyType,
  ProjectActionResponseSchema,
  ProjectActionResponseType,
  ProjectInfoParamsSchema,
  ProjectInfoParamsType,
  ProjectInfoResponseSchema,
  ProjectInfoResponseType,
  ProjectListResponseSchema,
  ProjectListResponseType,
  ProjectTreeParamsSchema,
  ProjectTreeParamsType,
  ProjectTreeResponseSchema,
  ProjectTreeResponseType,
} from '@/type/project.type'
import { checkTypeBoxSchema, generateResponse } from '@/util/app'
import { FastifyInstance } from 'fastify'
import { projectService } from './project.service'

export const projectRoute = async (app: FastifyInstance) => {
  app.route({
    method: 'get',
    url: '/info/:projectID',
    schema: {
      tags: ['project'],
      params: ProjectInfoParamsSchema,
      response: { 200: ProjectInfoResponseSchema },
    },
    preHandler: async (req, res) => {
      const params = req.params
      const result = checkTypeBoxSchema(ProjectInfoParamsSchema, params)
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
        const { projectID } = req.params as ProjectInfoParamsType
        const result = await projectService.getProjectByProjectID(projectID)
        const response: ProjectInfoResponseType = generateResponse(
          1,
          '',
          result,
        )
        return response
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
        return response
      } catch (error) {
        return res.code(500).send(generateResponse(0, '', null))
      }
    },
  })

  app.route({
    method: 'get',
    url: '/tree/:projectID',
    schema: {
      tags: ['project'],
      params: ProjectTreeParamsSchema,
      response: { 200: ProjectTreeResponseSchema },
    },
    preHandler: async (req, res) => {
      const params = req.params
      const result = checkTypeBoxSchema(ProjectTreeParamsSchema, params)
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
        const params = req.params as ProjectTreeParamsType
        const result = await projectService.generateProjectTree(
          params.projectID,
        )
        const response: ProjectTreeResponseType = generateResponse(
          1,
          '',
          result,
        )
        return response
      } catch (error) {
        return res.code(500).send(generateResponse(0, '', null))
      }
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
    preHandler: async (req, res) => {
      const body = req.body
      const result = checkTypeBoxSchema(ProjectActionBodySchema, body)
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
        const body = req.body as ProjectActionBodyType
        if (body.action === 'update') {
          await projectService.updateProjectName(
            body.projectID,
            body.projectName,
          )
        } else {
          await projectService.deleteProject(body.projectID)
        }
        const response: ProjectActionResponseType = generateResponse(
          1,
          '',
          'success',
        )
        return response
      } catch (error) {
        return res.code(500).send(generateResponse(0, '', null))
      }
    },
  })
}
