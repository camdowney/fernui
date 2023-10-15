import { useState, useEffect, Dispatch, SetStateAction, createContext, useContext, useRef } from 'react'
import { KeyObject, toDeepObject, cycle, stringifyMap } from '@fernui/util'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type FieldState = { value: any, modified: boolean, error: boolean }
export type FieldsMap = Map<string, FieldState>

export interface FormState {
  disabled: boolean
  setDisabled: SetState<boolean>
  exposed: boolean
  setExposed: SetState<boolean>
  fields: FieldsMap
  setFields: SetState<FieldsMap>
  values: KeyObject
  setValues: (newValues: KeyObject) => void
  isValid: boolean
  wasModified: boolean
  hasChanges: boolean
  pushChanges: () => void
}

export const useForm = (options?: { defaultValues?: KeyObject, disabled?: boolean, exposed?: boolean }) => {
  const {
    defaultValues,
    disabled: disabledInit,
    exposed: exposedInit
  } = options || {}

  const getFieldsMap = (fieldsCurr: FieldsMap, newValues: KeyObject, newModified?: boolean) => {
    const fieldsClean = new Map(fieldsCurr)

    Object.entries(newValues).forEach(([key, value]) => {
      fieldsClean.set(key, {
        modified: false,
        error: false,
        ...(fieldsClean.get(key) ?? {}),
        value,
        ...(newModified !== undefined && { modified: newModified })
      })
    })

    return fieldsClean
  }

  const [disabled, setDisabled] = useState(disabledInit ?? false)
  const [exposed, setExposed] = useState(exposedInit ?? false)

  const [fields, setFields] = useState<FieldsMap>(getFieldsMap(new Map(), defaultValues ?? {}))
  const [values, setValuesRaw] = useState<KeyObject>(defaultValues ?? {})

  const [isValid, setValid] = useState(false)
  const [wasModified, setModified] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const savedFields = useRef<string>('')

  const setValues = (newValues: KeyObject, newModified?: boolean) =>
    setFields(curr => getFieldsMap(curr, newValues, newModified))

  const pushChanges = () => {
    savedFields.current = stringifyMap(fields)
    setHasChanges(false)
  }

  const setValuesDeep = (newFields: FieldsMap) => {
    setValuesRaw(toDeepObject(Object.fromEntries(
      Array.from(newFields)
        .filter(([name]) => !name.startsWith('__config'))
        .map(([name, state]) => [name, state.value])
    )))
  }

  useEffect(() => {
    const newModified = Array.from(fields).some(([_, state]) => state.modified)
    
    setValuesDeep(fields)
    setValid(Array.from(fields).every(([_, state]) => !state.error))
    setModified(newModified)

    // True if user made change; else false for registering default values
    if (newModified)
      setHasChanges(stringifyMap(fields) !== savedFields.current)
    else
      pushChanges()
  }, [fields])

  const context: FormState = {
    disabled, setDisabled,
    exposed, setExposed,
    fields, setFields,
    values, setValues,
    isValid, wasModified,
    hasChanges, pushChanges,
  }

  return { context, ...context }
}

export const FormContext = createContext<FormState | null>(null)

export const useFormContext = () => useContext(FormContext) ?? useForm()

export const useField = <T extends unknown>(
  name: string,
  value: T,
  options?: {
    disabled?: boolean
    validate?: (newValue: T) => boolean
    onChange?: (newValue: T) => void
  }
) => {
  const {
    disabled: disabledInit,
    validate,
    onChange: onChangeProp
  } = options || {}

  const {
    disabled: formDisabled,
    exposed: formExposed,
    fields,
    setFields
  } = useFormContext()

  const calcValue = (fields.get(name) ?? { value }).value as T
  const disabled = disabledInit ?? formDisabled
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
      
    if (onChangeProp)
      onChangeProp(newValue)
  }

  // Handle manual value control
  useEffect(() => {
    onChange(value)
  }, [value === Object(value) ? JSON.stringify(value) : value])

  // Set initial state and cleanup
  useEffect(() => {
    setField(calcValue, false)

    return () => {
      fields.delete(name)
      setFields(new Map(fields))
    }
  }, [name])

  return { value: calcValue, disabled, showError, setField, onChange }
}

export const handleSubmit = (
  context: FormState,
  callback: () => any,
  onError?: (error: any) => any
) => async (e: any) => {
  if (e.preventDefault)
    e.preventDefault()

  const { setExposed, setDisabled, isValid } = context

  setExposed(true)

  try {
    if (!isValid)
      throw Error('invalid-input')

    setDisabled(true)

    await callback()
  }
  catch (error: any) {
    setDisabled(false)

    if (onError)
      onError(error)
  }
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
  open: (newIndex: number) => void
  previous: () => void
  next: () => void
}

export const useLightbox = (numItems: number, options?: { index?: number, active?: boolean }) => {
  const { index: indexInit, active: activeInit } = options || {}

  const [index, setIndex] = useState(indexInit ?? 0)
  const [active, setActive] = useState(activeInit ?? false)

  const open = (newIndex: number) => {
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