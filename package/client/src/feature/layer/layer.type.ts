export type LayerMenuItem = {
  key: string
  label: string
  action: (...params: unknown[]) => unknown
}
