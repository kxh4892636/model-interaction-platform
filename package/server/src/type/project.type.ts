import { Static, Type } from '@sinclair/typebox'
import { generateResponseSchema } from './util'

// /info/:projectID
export const ProjectInfoSchema = Type.Object({
  projectId: Type.String(),
  projectName: Type.String(),
  projectPositionZoom: Type.Array(Type.Number()),
  projectTag: Type.Array(Type.String()),
  datasetIDArray: Type.Array(Type.String()),
})
export type ProjectInfoType = Static<typeof ProjectInfoSchema>
export const ProjectInfoParamsSchema = Type.Object({ projectID: Type.String() })
export type ProjectInfoParamsType = Static<typeof ProjectInfoParamsSchema>
export const ProjectInfoResponseSchema =
  generateResponseSchema(ProjectInfoSchema)
export type ProjectInfoResponseType = Static<typeof ProjectInfoResponseSchema>

// /list
export const ProjectListSchema = Type.Array(ProjectInfoSchema)
export type ProjectListType = Static<typeof ProjectListSchema>
export const ProjectListResponseSchema =
  generateResponseSchema(ProjectListSchema)
export type ProjectListResponseType = Static<typeof ProjectListResponseSchema>

// /tree
export const ProjectTreeSchema = Type.Recursive((This) =>
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
export type ProjectTreeType = Static<typeof ProjectTreeSchema>
export const ProjectTreeParamsSchema = Type.Object({ projectID: Type.String() })
export type ProjectTreeParamsType = Static<typeof ProjectInfoParamsSchema>
export const ProjectTreeResponseSchema =
  generateResponseSchema(ProjectTreeSchema)
export type ProjectTreeResponseType = Static<typeof ProjectTreeResponseSchema>

// /action
export const ProjectActionSchema = Type.Union([
  Type.Literal('success'),
  Type.Literal('fail'),
])
export type ProjectActionType = Static<typeof ProjectActionSchema>
export const ProjectActionBodySchema = Type.Object({
  projectID: Type.String(),
  action: Type.Union([Type.Literal('update'), Type.Literal('delete')]),
  projectName: Type.String(),
})
export type ProjectActionBodyType = Static<typeof ProjectActionBodySchema>
export const ProjectActionResponseSchema =
  generateResponseSchema(ProjectActionSchema)
export type ProjectActionResponseType = Static<
  typeof ProjectActionResponseSchema
>
