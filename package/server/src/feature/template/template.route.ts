import {
  TemplateActionBodySchema,
  TemplateActionResponseSchema,
  TemplateActionResponseType,
  TemplateCoverParamsSchema,
  TemplateListResponseSchema,
  TemplateListResponseType,
} from '@/feature/template/template.type'
import { FastifyTypebox } from '@/type/app.type'
import { generateResponse } from '@/util/app'
import { templateService } from './template.service'

export const templateRoute = async (app: FastifyTypebox) => {
  app.route({
    method: 'get',
    url: '/list',
    schema: {
      tags: ['template'],
      response: {
        200: TemplateListResponseSchema,
      },
    },
    handler: async (): Promise<TemplateListResponseType> => {
      const result = await templateService.getTemplateList()
      const response = generateResponse(1, 'success', result)
      return response
    },
  })

  app.route({
    method: 'get',
    url: '/cover/:templateID',
    schema: {
      tags: ['template'],
      params: TemplateCoverParamsSchema,
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
      const cs = await templateService.getTemplateCoverImage(params.templateID)
      if (!cs) throw new Error()
      return res.type('image/png').send(cs)
    },
  })

  app.route({
    method: 'post',
    url: '/action',
    schema: {
      tags: ['template'],
      body: TemplateActionBodySchema,
      response: {
        200: TemplateActionResponseSchema,
      },
    },
    handler: async (req): Promise<TemplateActionResponseType> => {
      const body = req.body
      // todo only createFrom nowadays
      await templateService.createTemplate(body.templateID, body.projectName)
      const response = generateResponse(1, 'success', null)
      return response
    },
  })
}
