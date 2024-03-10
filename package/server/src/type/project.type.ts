import { Static, Type } from '@sinclair/typebox'
import { generateResponseSchema } from './util'

// /detail/:projectID
export const ProjectSchema = Type.Object({
  projectId: Type.String(),
  projectName: Type.String(),
  projectCoverImage: Type.String(),
  projectPositionZoom: Type.Array(Type.Number()),
  projectTag: Type.Array(Type.String()),
  datasetIDArray: Type.Array(Type.String()),
})
export type ProjectType = Static<typeof ProjectSchema>
export const ProjectParamsSchema = Type.Object({ projectID: Type.String() })
export type ProjectParamsType = Static<typeof ProjectParamsSchema>
export const ProjectResponseSchema = generateResponseSchema(ProjectSchema)
export type ProjectResponseType = Static<typeof ProjectResponseSchema>

// /list
export const ProjectListSchema = Type.Array(ProjectSchema)
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

// /action
export const ProjectActionSchema = Type.Union([
  Type.Literal('success'),
  Type.Literal('fail'),
])
export type ProjectActionType = Static<typeof ProjectActionSchema>
export const ProjectActionBodySchema = Type.Object({
  projectID: Type.String(),
  action: Type.Union([Type.Literal('update'), Type.Literal('delete')]),
  projectName: Type.Union([Type.String(), Type.Null()]),
})
export type ProjectActionBodyType = Static<typeof ProjectActionBodySchema>
export const ProjectActionResponseSchema =
  generateResponseSchema(ProjectActionSchema)
export type ProjectActionResponseType = Static<
  typeof ProjectActionResponseSchema
>
