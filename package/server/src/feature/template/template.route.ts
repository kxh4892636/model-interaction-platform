import {
  TemplateActionBodySchema,
  TemplateActionResponseSchema,
  TemplateActionResponseType,
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
    onError: (_, res) => {
      return res.code(500).send(generateResponse(0, 'error', null))
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
    onError: (_, res) => {
      return res.code(500).send(generateResponse(0, 'error', null))
    },
  })
}
