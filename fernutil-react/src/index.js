import { useEffect } from 'react'

export * from '../../fernutil/src'

export const useListener = (event, callback, element, passive = true) => {
  useEffect(() => {
    const current = element?.current || element || window
    current.addEventListener(event, callback, { passive })
    return () => current.removeEventListener(event, callback, { passive })
  }, [event, callback])
}