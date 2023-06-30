import { useState, useEffect, Dispatch, SetStateAction, createContext, useContext, useRef } from 'react'
import { collapseKeyValues, stringifyMap } from '@fernui/util'

export * from '@fernui/util'

export type SetState<T> = Dispatch<SetStateAction<T>>

export interface FormState {
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
  submitCount: number
  setSubmitCount: SetState<number>
  successCount: number
  setSuccessCount: SetState<number>
}

export const useForm = (initialOptions?: { editable: boolean, isExposed: boolean }) => {
  const [isEditable, setEditable] = useState(initialOptions?.editable ?? true)
  const [isExposed, setExposed] = useState(initialOptions?.isExposed ?? false)

  const [values, setValues] = useState<Map<string, any>>(new Map())
  const [modified, setModified] = useState<Map<string, boolean>>(new Map())
  const [errors, setErrors] = useState<Map<string, boolean>>(new Map())

  const [data, setData] = useState<any>(null)
  const [isValid, setValid] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [submitCount, setSubmitCount] = useState(0)
  const [successCount, setSuccessCount] = useState(0)

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
    setValid(!Array.from(errors.values()).some(Boolean))
  }, [errors])

  const pushChanges = () => {
    savedData.current = stringifyMap(values)
    setHasChanges(false)
  }

  const context: FormState = {
    isEditable, setEditable,
    isExposed, setExposed,
    values, setValues,
    modified, setModified,
    errors, setErrors,
    data, isValid,
    hasChanges, pushChanges,
    submitCount, setSubmitCount,
    successCount, setSuccessCount,
  }

  return { context, ...context }
}

export const FormContext = createContext<FormState | null>(null)

export const useFormContext = () => useContext(FormContext) ?? useForm()

export const useField = <T>(
  name: string,
  options?: {
    validate?: (newValue: T) => boolean
    defaultValue?: T
    value?: T
    onChange?: (newValue: T) => void
  }
) => {
  const { validate, defaultValue, value, onChange: _onChange } = options || {}

  const formContext = useFormContext()
  const { isExposed, values, setValues, modified, setModified, errors, setErrors } = formContext

  const showError = errors.get(name) && (modified.get(name) || isExposed)

  const setField = (newValue?: T, newModified?: boolean) => {
    if (newValue === undefined || newModified === undefined) return

    values.set(name, newValue)
    modified.set(name, newModified),
    errors.set(name, validate ? !validate(newValue) : true)

    setValues(new Map(values))
    setModified(new Map(modified))
    setErrors(new Map(errors))
  }

  const onChange = (newValue: T) => {
    setField(newValue, true)
      
    if (_onChange)
      _onChange(newValue)
  }

  // Handle manual value changing
  useEffect(() => {
    if (value !== undefined) {
      onChange(value)
    }
  }, [value])

  // Set initial state and cleanup
  useEffect(() => {
    setField(defaultValue, false)

    return () => {
      values.delete(name)
      modified.delete(name),
      errors.delete(name)

      setField()
    }
  }, [])

  return { ...formContext, setField, onChange, showError }
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