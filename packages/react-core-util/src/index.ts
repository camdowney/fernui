import { useState, useEffect, Dispatch, SetStateAction } from 'react'

export * from '@fernui/util'

export type SetState<T> = Dispatch<SetStateAction<T>>
export type FormControl = { editable: boolean, showErrors: boolean }
export type FieldData = { value: string, valid: boolean, modified: boolean }
export interface FormData extends Map<string, FieldData> {}

export interface FormContext {
  control: FormControl
  setControl: SetState<FormControl>
  fields: FormData
  setFields: SetState<FormData>
  getField: (name: string) => FieldData
  validate: () => boolean 
}

export const useForm = (initialControl: FormControl = { editable: true, showErrors: false }) => {
  const [control, setControl] = useState<FormControl>(initialControl)
  const [fields, setFields] = useState<FormData>(new Map())

  const getField = (name: string): FieldData =>
    fields.get(name) || { value: 'Field does not exist.', valid: false, modified: false }

  const validate = () =>
    Array.from(fields.entries()).every(([_, data]) => data.valid)

  const context: FormContext = { control, setControl, fields, setFields, getField, validate }

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