import { ResponseInterface } from '@/type'
import { TObject, TSchema, Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

export const generateResponse = <T>(
  status: 'success' | 'error',
  message: string,
  data: T,
): ResponseInterface<T> => {
  const response = {
    status,
    message,
    data,
  }

  return response
}

export const checkTypeBoxSchema = (
  schema: TObject,
  value: unknown,
): boolean => {
  const result = Value.Check(schema, value)
  return result
}

export const generateResponseSchema = <T extends TSchema>(schema: T) =>
  Type.Object({
    status: Type.Union([Type.Literal('success'), Type.Literal('error')]),
    data: Type.Union([schema, Type.Null()]),
    message: Type.String(),
  })
