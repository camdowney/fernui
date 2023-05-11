import { useEffect, useState } from 'react'

export const useListener = (
  event: string,
  callback: Function,
  options?: {
    element?: any
    dependencies?: any[]
    [x:string]: any
  }
) => {
  useEffect(() => {
    const current = options?.element?.current || options?.element || window
    
    current.addEventListener(event, callback, options?.rest)
    return () => current.removeEventListener(event, callback, options?.rest)
  }, [event, callback, ...(options?.dependencies ?? [])])
}

export const useRefresh = <T>(callback: (currentValue: T) => T | Promise<T>, options?: {
  initialValue?: T
  interval?: number
  onSuccess?: (newValue: T, oldValue: T) => any
  onError?: (error: any) => any
}): T => {
  const { initialValue = null as T, interval = 60000, onSuccess, onError } = options ?? {}

  const [data, setData] = useState(initialValue)
  let intervalId: any
  let skippedRefresh = false

  const refresh = async () => {
    if (document.hidden)
      return skippedRefresh = true

    try {
      const oldData = typeof data === 'object' ? structuredClone(data) : data
      const newData = await callback(data)
      setData(newData)
      onSuccess?.(newData, oldData)
    }
    catch (err) {
      onError?.(err)
    }
  }

  const fastRefresh = () => {
    if (document.hidden || !skippedRefresh)
      return

    clearInterval(intervalId)
    refresh()

    intervalId = setInterval(refresh, interval)
    skippedRefresh = false
  }

  useEffect(() => {
    intervalId = setInterval(refresh, interval)
    document.addEventListener('visibilitychange', fastRefresh)
    
    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', fastRefresh)
    }
  }, [data])

  return data
}