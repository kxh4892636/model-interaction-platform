import { useReducer } from 'react'

// NOTE
export const useForceUpdate = () => {
  const [_, forceUpdate] = useReducer((num) => num + 1, 0)
  return forceUpdate
}
