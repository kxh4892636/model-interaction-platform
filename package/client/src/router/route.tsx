import { LayerPanel } from '@/feature/layer'
import { ProjectView } from '@/feature/project'
import { ExtendRouterObject } from './router.type'

export const route: ExtendRouterObject[] = [
  {
    path: '/project',
    element: <ProjectView />,
    name: 'test',
  },
  {
    path: '/layer',
    element: <LayerPanel />,
    name: 'test',
  },
]
