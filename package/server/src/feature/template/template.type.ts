import { generateResponseSchema } from '@/type/util'
import { Static, Type } from '@sinclair/typebox'

// /template/info
export const TemplateSchema = Type.Object({
  templateId: Type.String(),
  templateName: Type.String(),
  templatePositionZoom: Type.Array(Type.Number()),
  templateTag: Type.Array(Type.String()),
})
export type TemplateType = Static<typeof TemplateSchema>

// /template/list
export const TemplateListSchema = Type.Array(TemplateSchema)
export type TemplateListType = Static<typeof TemplateListSchema>
export const TemplateListResponseSchema =
  generateResponseSchema(TemplateListSchema)
export type TemplateListResponseType = Static<typeof TemplateListResponseSchema>

// /template/cover
export const TemplateCoverParamsSchema = Type.Object({
  templateID: Type.String(),
})
export type TemplateCoverParamsType = Static<typeof TemplateCoverParamsSchema>

// /template/action
export const TemplateActionSchema = Type.Null()
export type TemplateActionType = Static<typeof TemplateActionSchema>
export const TemplateActionBodySchema = Type.Object({
  templateID: Type.String(),
  action: Type.Literal('createFrom'),
  projectName: Type.String(),
})
export type TemplateActionBodyType = Static<typeof TemplateActionBodySchema>
export const TemplateActionResponseSchema =
  generateResponseSchema(TemplateActionSchema)
export type TemplateActionResponseType = Static<
  typeof TemplateActionResponseSchema
>
