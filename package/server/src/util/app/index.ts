import { TObject } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

export const generateResponse = <T>(code: number, message: string, data: T) => {
  const response = {
    code,
    message,
    data,
  }

  return response
}

export const checkTypeBoxSchema = (schema: TObject, value: unknown) => {
  const result = Value.Check(schema, value)
  return result
}
