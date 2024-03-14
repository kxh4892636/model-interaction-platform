// model data {
//   data_id            String   @id @db.Uuid
//   data_name          String
//   data_type          String
//   data_style         String
//   data_extent        Float[]
//   data_timestamp     String
//   data_file_path     String
//   data_input         Boolean
//   data_visualization String[]
//   status             String
//   update_time        String
//   create_time        String
// }

import { Static, Type } from '@sinclair/typebox'
import { generateResponseSchema } from './util'

// /info
export const DataInfoSchema = Type.Object({
  dataID: Type.String(),
  dataName: Type.String(),
  dataType: Type.String(),
  dataStyle: Type.String(),
  dataExtent: Type.Array(Type.Number()),
  isInput: Type.Boolean(),
})
export type DataInfoType = Static<typeof DataInfoSchema>
export const DataInfoParamsSchema = Type.Object({
  dataID: Type.String(),
})
export type DataInfoParamsType = Static<typeof DataInfoParamsSchema>
export const DataInfoResponseSchema = generateResponseSchema(DataInfoSchema)
export type DataInfoResponseType = Static<typeof DataInfoResponseSchema>
