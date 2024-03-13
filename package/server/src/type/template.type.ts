import { generateResponseSchema } from '@/type/util'
import { Static, Type } from '@sinclair/typebox'

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

// /template/action
export const TemplateActionSchema = Type.Union([
  Type.Literal('success'),
  Type.Literal('fail'),
])
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
