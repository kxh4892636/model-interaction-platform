import { FastifyTypebox } from '@/type'
import { generateResponse } from '@/util/typebox'
import { randomUUID } from 'crypto'
import { projectService } from './project.service'
import {
  ProjectActionBodySchema,
  ProjectActionResponseSchema,
  ProjectActionResponseType,
  ProjectListQueryStringSchema,
  ProjectListResponseSchema,
  ProjectListResponseType,
  ProjectTreeQueryStringSchema,
  ProjectTreeResponseSchema,
  ProjectTreeResponseType,
} from './project.type'

export const projectRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/list',
    schema: {
      tags: ['project'],
      querystring: ProjectListQueryStringSchema,
      response: { 200: ProjectListResponseSchema },
    },
    handler: async (req): Promise<ProjectListResponseType> => {
      const { modelType } = req.query
      const result = await projectService.getAllProject(modelType)
      const response = generateResponse('success', '', result)
      return response
    },
  })

  app.route({
    method: 'get',
    url: '/tree',
    schema: {
      tags: ['project'],
      querystring: ProjectTreeQueryStringSchema,
      response: { 200: ProjectTreeResponseSchema },
    },
    handler: async (req): Promise<ProjectTreeResponseType> => {
      const params = req.query
      const result = await projectService.generateProjectTree(params.projectID)
      const response = generateResponse('success', '', result)
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
      const { action, projectID, projectName, projectExtent, modelType } =
        req.body
      const actionFnMap = {
        create: async () => {
          const projectID = randomUUID()
          const identifier = Date.now().toString()
          if (!projectExtent || !projectName) throw Error('')
          await projectService.createProject(
            projectID,
            projectName,
            projectExtent,
            identifier,
            'valid',
            modelType,
          )
          return projectID
        },
        delete: async () => {
          if (!projectID) throw Error()
          await projectService.deleteProject(projectID)
          return null
        },
      }
      const result = await actionFnMap[action]()
      const response = generateResponse('success', '', result)
      return response
    },
  })
}
