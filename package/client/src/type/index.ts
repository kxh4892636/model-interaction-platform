import { Static, Type } from '@sinclair/typebox'

export interface LayerType {
  layerName: string
  layerKey: string
  layerType: string
  layerStyle: string
  modelType: string
  isGroup: boolean
  children: LayerType[]
}

export interface AntdTreeInterface {
  title: string | JSX.Element
  key: string
  children: AntdTreeInterface[]
}

// NOTE 俩个 interface
export interface DataFetchAPIInterface<T> {
  status: 'error' | 'success'
  data: T | null
  message: string
}

export interface DataFetchHookInterface<T> {
  status: 'error' | 'pending' | 'success'
  data: T | null
  message: string
}

export const WaterModelTypeSchema = Type.Union([
  Type.Literal('water-2d'),
  Type.Literal('water-3d'),
  Type.Literal('quality-wasp'),
  Type.Literal('quality-phreec'),
  Type.Literal('quality-phreec-3d'),
  Type.Literal('sand'),
  Type.Literal('mud'),
  Type.Literal('ewe'),
  Type.Literal('water-ewe'),
])
export type WaterModelTypeType = Static<typeof WaterModelTypeSchema>

export const WaterDataTypeSchema = Type.Union([
  Type.Literal('mesh'),
  Type.Literal('text'),
  Type.Literal('geojson'),
  Type.Literal('uvet'),
  Type.Literal('tnd'),
  Type.Literal('ph'),
  Type.Literal('snd'),
  Type.Literal('yuji'),
  Type.Literal('mud'),
  Type.Literal('ewe'),
  Type.Literal('none'),
])
export type WaterDataTypeType = Static<typeof WaterDataTypeSchema>

export const WaterDataStyleSchema = Type.Union([
  Type.Literal('text'),
  Type.Literal('raster'),
  Type.Literal('circle'),
  Type.Literal('uvet'),
  Type.Literal('ewe'),
  Type.Literal('none'),
])
export type WaterDataStyleType = Static<typeof WaterDataStyleSchema>
