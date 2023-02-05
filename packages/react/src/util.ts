import { useEffect } from 'react'

export const useListener = (event: any, callback: Function, element?: any, passive = true) => {
  useEffect(() => {
    const current = element?.current || element || window
    current.addEventListener(event, callback, { passive })
    return () => current.removeEventListener(event, callback, { passive })
  }, [event, callback])
}