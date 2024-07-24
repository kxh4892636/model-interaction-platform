import { useMetaStore } from '@/store/metaStore'
import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import { routes } from './route'
import { useLayersStore } from '@/store/layerStore'
import { useMapStore } from '@/store/mapStore'

export const Router = () => {
  const location = useLocation()
  const link = useNavigate()
  const modelType = useMetaStore((state) => state.modelType)
  const element = useRoutes(routes)
  const metaInit = useMetaStore((state) => state.init)
  const layerInit = useLayersStore((state) => state.init)
  const map = useMapStore((state) => state.map)

  useLayoutEffect(() => {
    if (modelType === null && location.pathname.includes('model')) {
      setTimeout(() => {
        link('/home')
      }, 0)
    }
  }, [location])

  useEffect(() => {
    if (location.pathname.includes('home')) {
      metaInit()
      layerInit(map)
    }
  }, [location])

  return <div>{element}</div>
}
