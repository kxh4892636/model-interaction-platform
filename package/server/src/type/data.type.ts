// CREATE TABLE public.data
// (
//     data_id uuid NOT NULL,
//     data_name text NOT NULL,
//     data_type text NOT NULL,
//     data_style text NOT NULL,
//     data_extent double precision[] NOT NULL,
//     data_timestamp text NOT NULL,
//     data_file_path text NOT NULL,
//     data_input boolean NOT NULL,
//     data_transform text[],
//     status text NOT NULL,
//     update_time text NOT NULL,
//     create_time text NOT NULL,
//     PRIMARY KEY (data_id)
// );

import { Static, Type } from '@sinclair/typebox'

// /detail
export const DataDetailSchema = Type.Object({
  dataID: Type.String(),
  dataName: Type.String(),
  dataType: Type.String(),
  dataStyle: Type.String(),
  dataExtent: Type.Array(Type.Number()),
  isPut: Type.Boolean(),
})
export type DataDetailType = Static<typeof DataDetailSchema>
