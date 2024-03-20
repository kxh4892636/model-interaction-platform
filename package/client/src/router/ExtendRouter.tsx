import { useMapStore } from '@/store/mapStore'
import { useEffect } from 'react'
import { matchRoutes, useLocation } from 'react-router-dom'
import { route } from './route'

interface AppProps {
  children: JSX.Element | null
}
export const ExtendRouter = ({ children }: AppProps) => {
  const location = useLocation()
  const matches = matchRoutes(route, location)
  const setDisplay = useMapStore((state) => state.setDisplay)

  useEffect(() => {
    if (
      location.pathname.includes('/layer') ||
      location.pathname.includes('/info')
    ) {
      setDisplay(true)
    } else {
      setDisplay(false)
    }
  }, [location.pathname])

  return children
}
