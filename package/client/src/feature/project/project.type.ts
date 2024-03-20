import { generateResponseSchema } from '@/util/api'
import { Static, Type } from '@sinclair/typebox'

// server type
// project/info
const ProjectInfoSchema = Type.Object({
  projectId: Type.String(),
  projectName: Type.String(),
  projectPositionZoom: Type.Array(Type.Number()),
  projectTag: Type.Array(Type.String()),
  datasetIDArray: Type.Array(Type.String()),
})
export const ProjectInfoResponseSchema =
  generateResponseSchema(ProjectInfoSchema)
export type ProjectInfoResponseType = Static<typeof ProjectInfoResponseSchema>

// project//list
const ProjectListSchema = Type.Array(ProjectInfoSchema)
export const ProjectListResponseSchema =
  generateResponseSchema(ProjectListSchema)
export type ProjectListResponseType = Static<typeof ProjectListResponseSchema>

// project//tree
const ProjectTreeSchema = Type.Recursive((This) =>
  Type.Array(
    Type.Object({
      title: Type.String(),
      key: Type.String(),
      layerType: Type.String(),
      layerStyle: Type.String(),
      group: Type.Boolean(),
      isInput: Type.Boolean(),
      children: This,
    }),
  ),
)
export const ProjectTreeResponseSchema =
  generateResponseSchema(ProjectTreeSchema)
export type ProjectTreeResponseType = Static<typeof ProjectTreeResponseSchema>

// project//action
const ProjectActionSchema = Type.Null()
export const ProjectActionResponseSchema =
  generateResponseSchema(ProjectActionSchema)
export type ProjectActionResponseType = Static<
  typeof ProjectActionResponseSchema
>

export const TemplateSchema = Type.Object({
  templateId: Type.String(),
  templateName: Type.String(),
  templatePositionZoom: Type.Array(Type.Number()),
  templateTag: Type.Array(Type.String()),
})
export type TemplateType = Static<typeof TemplateSchema>

// /template/list
const TemplateListSchema = Type.Array(TemplateSchema)
export const TemplateListResponseSchema =
  generateResponseSchema(TemplateListSchema)
export type TemplateListResponseType = Static<typeof TemplateListResponseSchema>

// /template/action
const TemplateActionSchema = Type.Null()
export const TemplateActionResponseSchema =
  generateResponseSchema(TemplateActionSchema)
export type TemplateActionResponseType = Static<
  typeof TemplateActionResponseSchema
>

export interface ProjectInfoType {
  projectId: string
  projectName: string
  projectCoverImage: string
  projectPositionZoom: number[]
  projectTag: string[]
  datasetIDArray: string[]
}
export type ProjectListType = ProjectInfoType[]

export interface TemplateInfoType {
  templateID: string
  templateName: string
  templateCoverImage: string
  templateTag: string[]
}
export type TemplateListType = TemplateInfoType[]
