import { useState, useEffect, Dispatch, SetStateAction, createContext, useContext, useRef } from 'react'
import { collapseKeyValues, cycle, isObject, stringifyMap } from '@fernui/util'

export * from '@fernui/util'

export type SetState<T> = Dispatch<SetStateAction<T>>
export type FieldState = { value: any, modified: boolean, error: boolean }

export interface FormState {
  disabled: boolean
  setDisabled: SetState<boolean>
  exposed: boolean
  setExposed: SetState<boolean>
  fields: Map<string, FieldState>
  setFields: SetState<Map<string, FieldState>>
  data: any
  isValid: boolean
  hasChanges: boolean
  pushChanges: () => void
}

export const useForm = (options?: { disabled: boolean, exposed: boolean }) => {
  const { disabled: _disabled, exposed: _exposed } = options || {}

  const [disabled, setDisabled] = useState(_disabled ?? false)
  const [exposed, setExposed] = useState(_exposed ?? false)

  const [fields, setFields] = useState<Map<string, FieldState>>(new Map())

  const [data, setData] = useState<any>(null)
  const [isValid, setValid] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const savedData = useRef<string>('')

  useEffect(() => {
    setData(collapseKeyValues(Array.from(fields).map(([name, state]) => [name, state.value])))
    setValid(Array.from(fields).every(([_, state]) => !state.error))

    // True if user made change; else false for registering default values
    if (Array.from(fields).some(([_, state]) => state.modified))
      setHasChanges(stringifyMap(fields) !== savedData.current)
    else
      pushChanges()
  }, [fields])

  const pushChanges = () => {
    savedData.current = stringifyMap(fields)
    setHasChanges(false)
  }

  const context: FormState = {
    disabled, setDisabled,
    exposed, setExposed,
    fields, setFields,
    data, isValid,
    hasChanges, pushChanges,
  }

  return { context, ...context }
}

export const FormContext = createContext<FormState | null>(null)

export const useFormContext = () => useContext(FormContext) ?? useForm()

export const useField = <T>(
  name: string,
  options?: {
    defaultValue?: T
    value?: T
    disabled?: boolean
    validate?: (newValue: T) => boolean
    onChange?: (newValue: T) => void
  }
) => {
  const {
    defaultValue,
    value: _value,
    disabled: _disabled,
    validate,
    onChange: _onChange,
  } = options || {}

  const {
    disabled: formDisabled,
    exposed: formExposed,
    fields, setFields,
  } = useFormContext()

  const value = _value ?? (fields.get(name) ?? {}).value ?? defaultValue
  const disabled = _disabled ?? formDisabled
  const showError = (fields.get(name) ?? {}).error && ((fields.get(name) ?? {}).modified || formExposed)

  const setField = (newValue: T, newModified = true) => {
    fields.set(name, {
      value: newValue,
      modified: newModified,
      error: validate ? !validate(newValue) : false
    })

    setFields(new Map(fields))
  }

  const onChange = (newValue: T) => {
    setField(newValue)
      
    if (_onChange)
      _onChange(newValue)
  }

  // Handle manual value control
  useEffect(() => {
    if (_value !== undefined)
      onChange(_value)
  }, [_value])

  // Set initial state and cleanup
  useEffect(() => {
    if (defaultValue)
      setField(defaultValue)

    return () => {
      fields.delete(name)
      setFields(new Map(fields))
    }
  }, [name])

  return { value, disabled, showError, setField, onChange }
}

export const useRepeater = <T>(initialItems: T[] = []) => {
  const index = useRef(0)

  const getKey = () =>
    index.current++

  const [items, setItems] = useState<[number, T][]>(
    initialItems.map(item => [getKey(), item])
  )

  const insert = (item: T, newIndex?: number) => {
    if (newIndex === undefined || newIndex < 0 || newIndex >= items.length)
      items.push([getKey(), item])
    else
      items.splice(newIndex, 0, [getKey(), item])

    setItems(items.slice())
  }

  const remove = (index?: number) => {
    if (index === undefined || index < 0 || index > items.length - 1)
      items.pop()
    else
      items.splice(index, 1)
    
    setItems(items.slice())
  }

  const update = (newItem: T | ((currentValue: T) => T), index: number) => {
    if (index < 0 || index >= items.length)
      return

    items[index][1] = typeof newItem === 'function'
      ? (newItem as any)(items[index][1])
      : newItem

    setItems(items.slice())
  }

  const reset = (newItems: T[]) => {
    setItems(newItems.map(item => [getKey(), item]))
  }

  return { items, insert, remove, update, reset }
}

export interface LightboxControl {
  index: number
  setIndex: SetState<number>
  active: boolean
  setActive: SetState<boolean>
  open: (newIndex?: number) => void
  previous: () => void
  next: () => void
}

export const useLightbox = (numItems: number, options?: { index?: number, active?: boolean }) => {
  const { index: _index, active: _active } = options || {}

  const [index, setIndex] = useState(_index ?? 0)
  const [active, setActive] = useState(_active ?? false)

  const open = (newIndex: number = 0) => {
    setIndex(newIndex)
    setActive(true)
  }

  const previous = () => {
    setIndex(cycle(numItems, index, -1))
    setActive(true)
  }

  const next = () => {
    setIndex(cycle(numItems, index, 1))
    setActive(true)
  }

  const control: LightboxControl = { index, setIndex, active, setActive, open, previous, next }

  return { control, ...control }
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

      if (onSuccess)
        onSuccess(newData, oldData)
    }
    catch (err) {
      if (onError)
        onError(err)
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