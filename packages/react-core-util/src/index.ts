import { useState, useEffect, Dispatch, SetStateAction, createContext, useContext, useRef } from 'react'
import { collapseKeyValues, stringifyMap } from '@fernui/util'

export * from '@fernui/util'

export type SetState<T> = Dispatch<SetStateAction<T>>

export interface FormSharedContext {
  isEditable: boolean
  setEditable: SetState<boolean>
  isExposed: boolean
  setExposed: SetState<boolean>
  values: Map<string, any>
  setValues: SetState<Map<string, any>>
  modified: Map<string, boolean>
  setModified: SetState<Map<string, boolean>>
  errors: Map<string, boolean>
  setErrors: SetState<Map<string, boolean>>
  data: any
  isValid: boolean
  hasChanges: boolean
  pushChanges: () => void
}

export const useForm = (initialOptions = { editable: true, isExposed: false }) => {
  const [isEditable, setEditable] = useState<boolean>(initialOptions.editable ?? true)
  const [isExposed, setExposed] = useState<boolean>(initialOptions.isExposed ?? false)

  const [values, setValues] = useState<Map<string, any>>(new Map())
  const [modified, setModified] = useState<Map<string, boolean>>(new Map())
  const [errors, setErrors] = useState<Map<string, boolean>>(new Map())

  const [data, setData] = useState<any>(null)
  const [isValid, setValid] = useState<boolean>(false)
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  const savedData = useRef<string>('')

  useEffect(() => {
    setData(collapseKeyValues(Array.from(values)))

    // True if user made change; else false for registering default values
    if (Array.from(modified.values()).some(Boolean))
      setHasChanges(stringifyMap(values) !== savedData.current)
    else
      pushChanges()
  }, [values])

  useEffect(() => {
    setValid(Object.values(errors).every(isInvalid => !isInvalid))
  }, [errors])

  const pushChanges = () => {
    savedData.current = stringifyMap(values)
    setHasChanges(false)
  }

  const context: FormSharedContext = {
    isEditable, setEditable,
    isExposed, setExposed,
    values, setValues,
    modified, setModified,
    errors, setErrors,
    data, isValid, hasChanges, pushChanges
  }

  return { context, ...context }
}

export const FormContext = createContext<FormSharedContext | null>(null)

export const useFormContext = () => useContext(FormContext) ?? useForm()

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