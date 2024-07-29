import {
  WaterDataStyleSchema,
  WaterDataTypeSchema,
  WaterModelTypeSchema,
} from '@/type'
import { generateResponseSchema } from '@/util/typebox'
import { Static, Type } from '@sinclair/typebox'

// /api/v1/data/info
export const DataInfoSchema = Type.Object({
  dataID: Type.String(),
  dataName: Type.String(),
  dataType: WaterDataTypeSchema,
  dataStyle: WaterDataStyleSchema,
  dataExtent: Type.Array(Type.Number()),
  modelType: WaterModelTypeSchema,
  visualizationNumber: Type.Number(),
  status: Type.String(),
})
export type DataInfoType = Static<typeof DataInfoSchema>
export const DataInfoQueryStringSchema = Type.Object({
  dataID: Type.String(),
})
export type DataInfoQueryStringType = Static<typeof DataInfoQueryStringSchema>
export const DataInfoResponseSchema = generateResponseSchema(DataInfoSchema)
export type DataInfoResponseType = Static<typeof DataInfoResponseSchema>

// /api/v1/data/info/coord
export const DataInfoCoordSchema = Type.Array(Type.Number())
export type DataInfoCoordType = Static<typeof DataInfoCoordSchema>
export const DataInfoCoordQueryStringSchema = Type.Object({
  dataID: Type.String(),
  lng: Type.Number(),
  lat: Type.Number(),
})
export type DataInfoQueryStringCoord = Static<
  typeof DataInfoCoordQueryStringSchema
>
export const DataInfoCoordResponseSchema =
  generateResponseSchema(DataInfoCoordSchema)
export type DataInfoCoordResponse = Static<typeof DataInfoCoordResponseSchema>

// /api/v1/data/visualization
export const DataVisualizationQueryStringSchema = Type.Object({
  dataID: Type.String(),
  index: Type.Number(),
})
export type DataVisualizationQueryStringType = Static<
  typeof DataVisualizationQueryStringSchema
>

// /api/v1/data/upload
export const DataUploadSchema = Type.Null()
export type DataUploadType = Static<typeof DataUploadSchema>
export const DataUploadResponseSchema = generateResponseSchema(DataUploadSchema)
export type DataUploadResponseType = Static<typeof DataUploadResponseSchema>

// /api/v1/data/action
export const DataActionSchema = Type.Null()
export type DataActionType = Static<typeof DataActionSchema>
export const DataActionBodySchema = Type.Object({
  action: Type.Literal('delete'),
  dataID: Type.String(),
})
export type DataActionBodyType = Static<typeof DataActionBodySchema>
export const DataActionResponseSchema = generateResponseSchema(DataActionSchema)
export type DataActionResponseType = Static<typeof DataActionResponseSchema>
