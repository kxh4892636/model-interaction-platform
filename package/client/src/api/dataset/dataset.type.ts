import { Static, Type } from '@sinclair/typebox'
import { generateResponseSchema } from '../api.util'

// /action
export const DatasetActionSchema = Type.Null()
export type DatasetActionType = Static<typeof DatasetActionSchema>
export const DatasetActionBodySchema = Type.Object({
  datasetID: Type.String(),
  datasetAction: Type.Union([Type.Literal('delete')]),
})
export type DatasetActionBodyType = Static<typeof DatasetActionBodySchema>
export const DatasetActionResponseSchema =
  generateResponseSchema(DatasetActionSchema)
export type DatasetActionResponseType = Static<
  typeof DatasetActionResponseSchema
>
