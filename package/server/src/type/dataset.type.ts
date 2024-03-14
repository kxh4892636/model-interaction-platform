import { Static, Type } from '@sinclair/typebox'
import { generateResponseSchema } from './util'

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
export const DatasetActionSchema = Type.Union([
  Type.Literal('success'),
  Type.Literal('fail'),
])
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
