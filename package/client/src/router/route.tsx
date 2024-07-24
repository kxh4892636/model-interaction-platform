import { Home } from '@/page'
import { ModelPage } from '@/page/model'
import { Navigate, RouteObject } from 'react-router-dom'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={'/home'}></Navigate>,
  },
  {
    element: <Home></Home>,
    path: '/home',
  },
  {
    element: <ModelPage></ModelPage>,
    path: '/model',
  },
]
