import { useMapStore } from '@/store/mapStore'
import { useProjectStatusStore } from '@/store/projectStore'
import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// NOTE useLocation matchRoutes
interface AppProps {
  children: JSX.Element | null
}
export const ExtendRouter = ({ children }: AppProps) => {
  const location = useLocation()
  const setDisplay = useMapStore((state) => state.setDisplay)
  const link = useNavigate()
  const projectID = useProjectStatusStore((state) => state.projectID)

  useEffect(() => {
    link('/project')
  }, [])

  useLayoutEffect(() => {
    if (!projectID) {
      link('/project')
    }
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
