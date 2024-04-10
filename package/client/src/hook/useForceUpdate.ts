import { useReducer } from 'react'

// NOTE
export const useForceUpdate = () => {
  const [updateTag, forceUpdate] = useReducer((num) => num + 1, 0)
  return [updateTag, forceUpdate]
}
