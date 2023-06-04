import { useState, useEffect, Dispatch, SetStateAction } from 'react'

export * from '@fernui/util'

export type SetState<T> = Dispatch<SetStateAction<T>>
export type FormLowerContext = { editable: boolean, error: boolean }
export type FormValues = { [x:string]: string | undefined }
export type FormErrors = { [x:string]: boolean | undefined }

export interface FormContext {
  _context: FormLowerContext
  setContext: SetState<FormLowerContext>
  values: FormValues
  setValues: SetState<FormValues>
  errors: FormErrors
  setErrors: SetState<FormErrors>
}

export const useForm = () => {
  const [values, setValues] = useState<FormValues>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [_context, setContext] = useState({ editable: true, error: false })

  const context: FormContext = { _context, setContext, values, setValues, errors, setErrors }

  return { context, ...context }
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