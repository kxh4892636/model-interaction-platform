export interface Layer {
  title: string
  key: string
  type: string
  layerStyle: string
  group: boolean
  children: Layer[]
  input: boolean
}
