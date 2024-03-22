import { generateResponseSchema } from '@/type/util'
import { Static, Type } from '@sinclair/typebox'

export type ModelDataTypeType =
  | 'mesh'
  | 'text'
  | 'geojson'
  | 'uvet'
  | 'tcd'
  | 'tnd'
  | 'snd'
  | 'yuji'
// | 'image'
// | 'shp'

export type ModelDataStyleType = 'text' | 'raster' | 'circle' | 'uvet'
// | 'none'

// /model/info
export const ModelInfoSchema = Type.Object({
  modelID: Type.String(),
  modelDatasetID: Type.String(),
  progress: Type.Number(),
  modelStatus: Type.Number(),
})
export type ModelInfoType = Static<typeof ModelInfoSchema>
export const ModelInfoParamsSchema = Type.Object({
  modelID: Type.String(),
})
export type ModelInfoParamType = Static<typeof ModelInfoParamsSchema>
export const ModelInfoResponseSchema = generateResponseSchema(ModelInfoSchema)
export type ModelInfoResponseType = Static<typeof ModelInfoResponseSchema>

// /model/action
export const ModelActionSchema = Type.Union([Type.String(), Type.Null()])
export type ModelActionType = Static<typeof ModelActionSchema>
export const ModelActionBodySchema = Type.Object({
  modelID: Type.Union([Type.String(), Type.Null()]),
  action: Type.Union([Type.Literal('run'), Type.Literal('stop')]),
  modelInit: Type.Union([
    Type.Null(),
    Type.Object({
      modelType: Type.Union([
        Type.Literal('water'),
        Type.Literal('quality'),
        Type.Literal('sand'),
      ]),
      modelName: Type.String(),
      projectID: Type.String(),
      paramsID: Type.String(),
      hours: Type.Number(),
      uvetID: Type.Union([Type.Null(), Type.String()]),
    }),
  ]),
})
export type ModelActionBodyType = Static<typeof ModelActionBodySchema>
export const ModelActionResponseSchema =
  generateResponseSchema(ModelActionSchema)
export type ModelActionResponseType = Static<typeof ModelActionResponseSchema>
