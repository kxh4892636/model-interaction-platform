import { generateResponseSchema } from '@/util/api'
import { Static, Type } from '@sinclair/typebox'

export type LayerMenuItemType = {
  key: string
  label: string
  action: () => void
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

// /info
export const DataInfoSchema = Type.Object({
  dataID: Type.String(),
  dataName: Type.String(),
  dataType: Type.String(),
  dataStyle: Type.String(),
  dataExtent: Type.Array(Type.Number()),
  isInput: Type.Boolean(),
  visualizationNumber: Type.Number(),
})
export type DataInfoType = Static<typeof DataInfoSchema>
export const DataInfoParamsSchema = Type.Object({
  dataID: Type.String(),
})
export type DataInfoParamsType = Static<typeof DataInfoParamsSchema>
export const DataInfoResponseSchema = generateResponseSchema(DataInfoSchema)
export type DataInfoResponseType = Static<typeof DataInfoResponseSchema>

// /visualization
export const DataVisualizationQueryStringSchema = Type.Object({
  dataID: Type.String(),
  index: Type.Number(),
})
export type DataVisualizationQueryStringType = Static<
  typeof DataVisualizationQueryStringSchema
>

// /action
export const DataActionSchema = Type.Null()
export type DataActionType = Static<typeof DataActionSchema>
export const DataActionBodySchema = Type.Object({
  dataID: Type.String(),
  action: Type.Union([Type.Literal('rename')]),
  dataName: Type.String(),
})
export type DataActionBodyType = Static<typeof DataActionBodySchema>
export const DataActionResponseSchema = generateResponseSchema(DataActionSchema)
export type DataActionResponseType = Static<typeof DataActionResponseSchema>

// /list
export const DatasetListSchema = Type.Array(
  Type.Object({
    datasetID: Type.String(),
    datasetName: Type.String(),
    isInput: Type.Boolean(),
    dataIDList: Type.Array(Type.String()),
  }),
)
export type DatasetListType = Static<typeof DatasetListSchema>
export const DatasetListResponseSchema =
  generateResponseSchema(DatasetListSchema)
export type DatasetListResponseType = Static<typeof DatasetListResponseSchema>

// /action
export const DatasetActionSchema = Type.Null()
export type DatasetActionType = Static<typeof DatasetActionSchema>
export const DatasetActionBodySchema = Type.Object({
  datasetID: Type.String(),
  datasetName: Type.String(),
  datasetAction: Type.Union([
    Type.Literal('create'),
    Type.Literal('rename'),
    Type.Literal('delete'),
  ]),
})
export type DatasetActionBodyType = Static<typeof DatasetActionBodySchema>
export const DatasetActionResponseSchema =
  generateResponseSchema(DatasetActionSchema)
export type DatasetActionResponseType = Static<
  typeof DatasetActionResponseSchema
>
