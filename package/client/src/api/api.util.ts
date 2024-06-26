import { TSchema, Type } from '@sinclair/typebox'

export const generateResponseSchema = <T extends TSchema>(schema: T) =>
  Type.Object({
    status: Type.Union([Type.Literal('success'), Type.Literal('error')]),
    data: Type.Union([schema, Type.Null()]),
    message: Type.String(),
  })

export const extendFetch = async (
  url: string,
  option: RequestInit,
  timeout = 10000,
  retry = 3,
) => {
  let num = 0
  let response
  while (num < retry) {
    const abortController = new AbortController()
    const timeoutID = setTimeout(() => {
      abortController.abort()
    }, timeout)

    response = await fetch(url, { ...option, signal: abortController.signal })
      .then((res) => {
        return res
      })
      .catch(() => {
        return null
      })
    clearTimeout(timeoutID)
    if (response) return response
    else num++
  }
  throw Error(`fetch fail after ${retry} times`)
}
