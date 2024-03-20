import {
  ProjectActionBodySchema,
  ProjectActionResponseSchema,
  ProjectActionResponseType,
  ProjectInfoParamsSchema,
  ProjectInfoResponseSchema,
  ProjectInfoResponseType,
  ProjectListResponseSchema,
  ProjectListResponseType,
  ProjectTreeParamsSchema,
  ProjectTreeResponseSchema,
  ProjectTreeResponseType,
} from '@/feature/project/project.type'
import { FastifyTypebox } from '@/type/app.type'
import { generateResponse } from '@/util/app'
import { projectService } from './project.service'

export const projectRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/info/:projectID',
    schema: {
      tags: ['project'],
      params: ProjectInfoParamsSchema,
      response: { 200: ProjectInfoResponseSchema },
    },
    handler: async (req): Promise<ProjectInfoResponseType> => {
      const { projectID } = req.params
      const result = await projectService.getProjectByProjectID(projectID)
      const response = generateResponse(1, 'success', result)
      return response
    },
  })

  app.route({
    method: 'get',
    url: '/cover/:projectID',
    schema: {
      tags: ['project'],
      params: ProjectInfoParamsSchema,
      response: {
        200: {
          content: {
            'image/png': {
              schema: {},
            },
          },
        },
      },
    },
    handler: async (req, res) => {
      const params = req.params
      const cs = await projectService.getProjectCoverImage(params.projectID)
      if (!cs) throw new Error()
      return res.type('image/png').send(cs)
    },
  })

  app.route({
    method: 'get',
    url: '/list',
    schema: {
      tags: ['project'],
      response: { 200: ProjectListResponseSchema },
    },
    handler: async (): Promise<ProjectListResponseType> => {
      const result = await projectService.getAllProject()
      const response = generateResponse(1, 'success', result)
      return response
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
    handler: async (req): Promise<ProjectTreeResponseType> => {
      const params = req.params
      const result = await projectService.generateProjectTree(params.projectID)
      const response = generateResponse(1, 'success', result)
      return response
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
    handler: async (req): Promise<ProjectActionResponseType> => {
      const body = req.body
      if (body.action === 'update') {
        await projectService.updateProjectName(body.projectID, body.projectName)
      } else {
        await projectService.deleteProject(body.projectID)
      }
      const response = generateResponse(1, 'success', null)
      return response
    },
  })
}
