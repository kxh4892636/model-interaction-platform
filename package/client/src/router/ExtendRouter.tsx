import { useEffect } from 'react'
import { matchRoutes, useLocation } from 'react-router-dom'
import { route } from './route'

interface AppProps {
  children: JSX.Element | null
}
export const ExtendRouter = ({ children }: AppProps) => {
  const location = useLocation()
  const matches = matchRoutes(route, location)

  useEffect(() => {
    console.log(location)
    console.log(matches)
  }, [location.pathname])

  return children
}
