import { DBStatusSchema, WaterModelTypeSchema } from '@/type'
import { generateResponseSchema } from '@/util/typebox'
import { Static, Type } from '@sinclair/typebox'

// /model/info
export const ModelInfoSchema = Type.Object({
  modelID: Type.String(),
  modelDatasetID: Type.String(),
  modelProgress: Type.Number(),
  modelStatus: DBStatusSchema,
})
export type ModelInfoType = Static<typeof ModelInfoSchema>
export const ModelInfoQueryStringSchema = Type.Object({
  modelID: Type.String(),
})
export type ModelInfoParamType = Static<typeof ModelInfoQueryStringSchema>
export const ModelInfoResponseSchema = generateResponseSchema(ModelInfoSchema)
export type ModelInfoResponseType = Static<typeof ModelInfoResponseSchema>

// /model/param/*
export const ModelParamSchema = Type.Null()
export type ModelParamType = Static<typeof ModelParamSchema>
export const ModelParamResponseSchema = generateResponseSchema(ModelParamSchema)
export type ModelParamResponseType = Static<typeof ModelParamResponseSchema>
// /model/param/water-2d
export const Water2DParamBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
export type Water2DParamBodyType = Static<typeof Water2DParamBodySchema>
// /model/param/water-3d
export const Water3DParamBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
export type Water3DParamBodyType = Static<typeof Water3DParamBodySchema>
// /model/param/quality-wasp
export const QualityWaspParamBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
// /model/param/quality-phreec
export const QualityPhreecParamBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
export type QualityPhreecParamBodyType = Static<
  typeof QualityPhreecParamBodySchema
>
// /model/param/quality-phreec-3d
export const QualityPhreec3DParamBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
export type QualityPhreec3DParamBodyType = Static<
  typeof QualityPhreec3DParamBodySchema
>
// /model/param/sand
export const SandParamBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
export type SandParamBodyType = Static<typeof SandParamBodySchema>
// /model/param/mud
export const MudParamBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
export type MudParamBodyType = Static<typeof MudParamBodySchema>
// /model/param/water-ewe
export const WaterEweBodySchema = Type.Object({
  projectID: Type.String(),
  hours: Type.Integer(),
})
export type TWaterEweBody = Static<typeof WaterEweBodySchema>

// /model/action
export const ModelActionSchema = Type.Union([Type.String(), Type.Null()])
export type ModelActionType = Static<typeof ModelActionSchema>
export const ModelActionBodySchema = Type.Object({
  modelID: Type.Union([Type.String(), Type.Null()]),
  action: Type.Union([Type.Literal('run'), Type.Literal('stop')]),
  modelInit: Type.Union([
    Type.Null(),
    Type.Object({
      projectID: Type.String(),
      modelType: WaterModelTypeSchema,
      modelName: Type.String(),
    }),
  ]),
})
export type ModelActionBodyType = Static<typeof ModelActionBodySchema>
export const ModelActionResponseSchema =
  generateResponseSchema(ModelActionSchema)
export type ModelActionResponseType = Static<typeof ModelActionResponseSchema>
