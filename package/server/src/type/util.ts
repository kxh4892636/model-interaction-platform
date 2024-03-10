import { TSchema, Type } from '@sinclair/typebox'

export const generateResponseSchema = <T extends TSchema>(schema: T) =>
  Type.Object({
    code: Type.Number(),
    data: Type.Union([schema, Type.Null()]),
    message: Type.String(),
  })
