import { useEffect } from 'react'

export const useListener = (event: string, callback: Function, element?: any, options?: Object | boolean) => {
  useEffect(() => {
    const current = element?.current || element || window
    current.addEventListener(event, callback, options)
    return () => current.removeEventListener(event, callback, options)
  }, [event, callback])
}