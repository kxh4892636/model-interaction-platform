export interface Layer {
  title: string
  key: string
  type: string
  layerStyle: string
  group: boolean
  children: Layer[]
  input: boolean
}

export interface DataQueryHookInterface<T> {
  status: 'pending' | 'error' | 'success'
  data: T | null
  error: string | null
}
