import {
  Static,
  Type,
  TypeBoxTypeProvider,
} from '@fastify/type-provider-typebox'
import {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify'

export interface ResponseInterface<T> {
  status: 'success' | 'error'
  message: string
  data: T
}

export type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>

export const DBStatusSchema = Type.Union([
  Type.Literal('valid'),
  Type.Literal('pending'),
  Type.Literal('expire'),
])
export type DBStatusType = Static<typeof DBStatusSchema>

export const WaterModelTypeSchema = Type.Union([
  Type.Literal('water-2d'),
  Type.Literal('water-3d'),
  Type.Literal('quality-wasp'),
  Type.Literal('quality-phreec'),
  Type.Literal('sand'),
  Type.Literal('mud'),
])
export type WaterModelTypeType = Static<typeof WaterModelTypeSchema>

export const WaterDataTypeSchema = Type.Union([
  Type.Literal('mesh'),
  Type.Literal('text'),
  Type.Literal('geojson'),
  Type.Literal('uvet'),

  Type.Literal('tnd'),
  Type.Literal('snd'),
  Type.Literal('yuji'),
  Type.Literal('mud'),
  Type.Literal('none'),
])
export type WaterDataTypeType = Static<typeof WaterDataTypeSchema>

export const WaterDataStyleSchema = Type.Union([
  Type.Literal('text'),
  Type.Literal('raster'),
  Type.Literal('circle'),
  Type.Literal('uvet'),
  Type.Literal('none'),
])
export type WaterDataStyleType = Static<typeof WaterDataStyleSchema>
