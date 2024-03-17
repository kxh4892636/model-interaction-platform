import { Static, Type } from '@sinclair/typebox'
import { generateResponseSchema } from '../../type/util'

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
