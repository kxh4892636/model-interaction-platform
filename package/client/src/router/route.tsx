import { ProjectView } from '@/feature/__project'
import { LayerPanel } from '@/feature/layer'
import App from '@/feature/model/App'
import routes from '@/feature/model/route'
import { ExtendRouterObject } from './router.type'

export const route: ExtendRouterObject[] = [
  {
    path: '/project',
    element: <ProjectView />,
    name: 'project',
  },
  {
    path: '/layer',
    element: <LayerPanel />,
    name: 'layer',
  },
  {
    path: '/model',
    element: <App />,
    name: 'model',
    children: routes,
  },
]
