import { generateResponseSchema } from '@/util/api'
import { Static, Type } from '@sinclair/typebox'

export type LayerMenuItemType = {
  key: string
  label: string
  action: (...params: unknown[]) => unknown
}

// /api/project/tree/:projectID
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
export const ProjectTreeResponseSchema =
  generateResponseSchema(ProjectTreeSchema)
export type ProjectTreeResponseType = Static<typeof ProjectTreeResponseSchema>
