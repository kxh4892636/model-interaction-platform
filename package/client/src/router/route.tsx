import { LayerPanel } from '@/feature/layer'
import { ExtendRouterObject } from './router.type'

export const route: ExtendRouterObject[] = [
  {
    path: '/layer',
    element: <LayerPanel />,
    name: 'test',
  },
]
