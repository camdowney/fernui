import { useState, useEffect, Dispatch, SetStateAction, createContext, useContext, useRef } from 'react'
import { KeyObject, toDeepObject, cycle, stringify } from '@fernui/util'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type FieldState = {
  value: any
  modified: boolean
  error: boolean
  validate: ((newValue: any) => boolean) | null
}

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

export const useForm = (options?: {
  defaultValues?: KeyObject
  disabled?: boolean
  exposed?: boolean
  dependencies?: any[]
}) => {
  // Destructure props
  const {
    defaultValues,
    disabled: disabledInit,
    exposed: exposedInit,
    dependencies,
  } = options || {}

  // Extract values from fields
  const getValues = (fields: FieldsMap) =>
    Array.from(fields).map(([name, state]) => [name, state.value])

  // Values are calculated after fields
  const getValuesDeep = (newFields: FieldsMap) =>
    toDeepObject(Object.fromEntries(
      getValues(newFields).filter(([name]) => !name.startsWith('__config'))
    ))

  // Calculate new fields based on old fields and new field values or modified
  const getFieldsMap = (fieldsCurr: FieldsMap, newValues: KeyObject, newModified?: boolean) =>
    Object.entries(newValues).reduce((acc, [key, value]) => {
      const field = acc.get(key) ?? { modified: false, error: false, validate: null }

      acc.set(key, {
        ...field,
        value,
        ...(newModified !== undefined && { modified: newModified }),
        ...(field.validate && { error: !field.validate(value) })
      })

      return acc
    }, new Map(fieldsCurr))

  const [disabled, setDisabled] = useState(disabledInit ?? false)
  const [exposed, setExposed] = useState(exposedInit ?? false)

  const [fields, setFields] = useState<FieldsMap>(getFieldsMap(new Map(), defaultValues ?? {}))
  const [values, setValuesRaw] = useState<KeyObject>(defaultValues ?? {})

  const [isValid, setValid] = useState(false)
  const [wasModified, setModified] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Abstract user-facing method which recalculates fields then values
  const setValues = (newValues: KeyObject, newModified?: boolean) =>
    setFields(curr => getFieldsMap(curr, newValues, newModified))

  // User-facing method
  const pushChanges = () => {
    setFields(curr => getFieldsMap(curr, getValues(curr), false))
    setHasChanges(false)
  }

  // Recalculate initial values
  useEffect(() => {
    if (defaultValues)
      setValues(defaultValues)

    if (disabledInit !== undefined)
      setDisabled(disabledInit)

    if (exposedInit !== undefined)
      setExposed(exposedInit)
  }, [stringify(defaultValues), disabledInit, exposedInit, ...(dependencies ?? [])])

  // Recalculate values when fields change
  useEffect(() => {
    const newModified = Array.from(fields).some(([_, state]) => state.modified)
    
    setValuesRaw(getValuesDeep(fields))
    setValid(Array.from(fields).every(([_, state]) => !state.error))

    if (!newModified) return

    setModified(true)
    setHasChanges(true)
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
    validate = null,
    onChange: onChangeProp
  } = options || {}

  const {
    disabled: formDisabled,
    exposed: formExposed,
    fields,
    setFields
  } = useFormContext()

  const field = fields.get(name) ?? { value, modified: false, error: false }
  const valueClean = field.value as T
  const disabledClean = disabledInit ?? formDisabled
  const showError = field.error && (field.modified || formExposed)

  // Lowest level way to update the field
  const setField = (newValue: T, newModified = true) => {
    fields.set(name, {
      value: newValue,
      modified: newModified,
      error: validate ? !validate(newValue) : false,
      validate,
    })

    setFields(new Map(fields))
  }

  // Usually only used by field component
  const onChange = (newValue: T) => {
    setField(newValue)
      
    if (onChangeProp)
      onChangeProp(newValue)
  }

  // Handle manual value control
  useEffect(() => onChange(value), [stringify(value)])

  // Set initial state and cleanup
  useEffect(() => {
    setField(valueClean, false)

    return () => {
      fields.delete(name)
      setFields(new Map(fields))
    }
  }, [name])

  return { value: valueClean, disabled: disabledClean, showError, setField, onChange }
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