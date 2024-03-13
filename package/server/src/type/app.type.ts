export interface ResponseInterface<T> {
  code: number
  message: string
  data: T
}
