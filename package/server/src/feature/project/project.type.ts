import {
  WaterDataStyleSchema,
  WaterDataTypeSchema,
  WaterModelTypeSchema,
} from '@/type'
import { Static, Type } from '@sinclair/typebox'
import { generateResponseSchema } from '../../util/typebox'

// /api/v1/project/info
export const ProjectInfoSchema = Type.Object({
  projectId: Type.String(),
  projectName: Type.String(),
  projectExtent: Type.Array(Type.Number()),
})
export type ProjectInfoType = Static<typeof ProjectInfoSchema>
export const ProjectInfoQueryStringSchema = Type.Object({
  projectID: Type.String(),
})
export type ProjectInfoQueryStringType = Static<
  typeof ProjectInfoQueryStringSchema
>
export const ProjectInfoResponseSchema =
  generateResponseSchema(ProjectInfoSchema)
export type ProjectInfoResponseType = Static<typeof ProjectInfoResponseSchema>

// /api/v1/project/list
export const ProjectListSchema = Type.Array(ProjectInfoSchema)
export type ProjectListType = Static<typeof ProjectListSchema>
export const ProjectListResponseSchema =
  generateResponseSchema(ProjectListSchema)
export type ProjectListResponseType = Static<typeof ProjectListResponseSchema>

// /api/v1/project/tree
export const ProjectTreeSchema = Type.Recursive((This) =>
  Type.Array(
    Type.Object({
      layerName: Type.String(),
      layerKey: Type.String(),
      layerType: WaterDataTypeSchema,
      layerStyle: WaterDataStyleSchema,
      modelType: WaterModelTypeSchema,
      isGroup: Type.Boolean(),
      children: This,
    }),
  ),
)
export type ProjectTreeType = Static<typeof ProjectTreeSchema>
export const ProjectTreeQueryStringSchema = Type.Object({
  projectID: Type.String(),
})
export type ProjectTreeQueryStringType = Static<
  typeof ProjectInfoQueryStringSchema
>
export const ProjectTreeResponseSchema =
  generateResponseSchema(ProjectTreeSchema)
export type ProjectTreeResponseType = Static<typeof ProjectTreeResponseSchema>

// /api/v1/project/action
export const ProjectActionSchema = Type.Union([Type.String(), Type.Null()])
export type ProjectActionType = Static<typeof ProjectActionSchema>
export const ProjectActionBodySchema = Type.Object({
  action: Type.Union([Type.Literal('create'), Type.Literal('delete')]),
  projectID: Type.Union([Type.String(), Type.Null()]),
  projectName: Type.Union([Type.String(), Type.Null()]),
  projectExtent: Type.Union([Type.Null(), Type.Array(Type.Number())]),
})
export type ProjectActionBodyType = Static<typeof ProjectActionBodySchema>
export const ProjectActionResponseSchema =
  generateResponseSchema(ProjectActionSchema)
export type ProjectActionResponseType = Static<
  typeof ProjectActionResponseSchema
>
