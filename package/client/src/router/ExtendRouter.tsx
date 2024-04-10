import { useMapStore } from '@/store/mapStore'
import { useMetaStore } from '@/store/metaStore'
import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface AppProps {
  children: JSX.Element | null
}
export const ExtendRouter = ({ children }: AppProps) => {
  const location = useLocation()
  const setDisplay = useMapStore((state) => state.setDisplay)
  const link = useNavigate()
  const projectID = useMetaStore((state) => state.projectID)

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
