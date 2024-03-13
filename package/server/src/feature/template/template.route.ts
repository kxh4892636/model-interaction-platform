import {
  TemplateActionBodySchema,
  TemplateActionBodyType,
  TemplateActionResponseSchema,
  TemplateActionResponseType,
  TemplateListResponseSchema,
  TemplateListResponseType,
} from '@/type/template.type'
import { checkTypeBoxSchema, generateResponse } from '@/util/app'
import { FastifyInstance } from 'fastify'
import { templateService } from './template.service'

export const templateRoute = async (app: FastifyInstance) => {
  app.route({
    method: 'get',
    url: '/list',
    schema: {
      tags: ['template'],
      response: {
        200: TemplateListResponseSchema,
      },
    },
    handler: async (_, res) => {
      try {
        const result = await templateService.getTemplateList()
        const response: TemplateListResponseType = generateResponse(
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
    preHandler: async (req, res) => {
      const body = req.body as TemplateActionBodyType
      const result = checkTypeBoxSchema(TemplateActionBodySchema, body)
      if (!result) {
        return res
          .code(500)
          .send(generateResponse(0, 'the body of this request is wrong', null))
      }
    },
    handler: async (req, res) => {
      try {
        const body = req.body as TemplateActionBodyType
        // todo only createFrom nowadays
        await templateService.createTemplate(body.templateID, body.projectName)
        const response: TemplateActionResponseType = generateResponse(
          1,
          '',
          'success',
        )
        return res.code(200).send(response)
      } catch (error) {
        return res.code(500).send(generateResponse(0, '', null))
      }
    },
  })
}
