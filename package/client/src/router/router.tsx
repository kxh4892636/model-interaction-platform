import { Home } from '@/page'
import { ModelPage } from '@/page/model'
import { RouteObject } from 'react-router-dom'

export const routes: RouteObject[] = [
  {
    element: <Home></Home>,
    path: '/home',
  },
  {
    element: <ModelPage></ModelPage>,
    path: '/model',
  },
]
