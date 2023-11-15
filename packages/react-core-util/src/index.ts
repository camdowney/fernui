import { useState, useEffect, Dispatch, SetStateAction, createContext, useContext, useRef } from 'react'
import { KeyObject, toDeepObject, cycle, stringify, objectHasValue, objectToURI } from '@fernui/util'

export type SetState<T> = Dispatch<SetStateAction<T>>

export const useEffectWhile = (callback: () => any, dependencies?: any[]) => {
  const toggle = useRef(false)

  useEffect(() => {
    if (toggle.current) return
    if (!callback()) toggle.current = true
  }, dependencies)
}

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
  valuesLoading: boolean
  hasChanges: boolean
  pushChanges: () => void
  onSubmit: ((e: any) => Promise<void>) | null
  successCount: number
}

export type FormEventHandlerProps<T = {}> = Pick<FormState, 'fields' | 'values' | 'isValid' | 'successCount'> & T
export type FormErrorHandlerProps = FormEventHandlerProps<{ error: any }>
export type FormEventHandler = (props: FormEventHandlerProps) => any
export type FormErrorHandler = (props: FormErrorHandlerProps) => any

export interface FormOptions {
  defaultValues?: KeyObject
  isLoading?: boolean
  disabled?: boolean
  exposed?: boolean
  onLoad?: FormEventHandler
  onChange?: FormEventHandler
  onSubmit?: FormEventHandler
  onError?: FormErrorHandler
}

export const useForm = ({
  defaultValues = {},
  isLoading,
  disabled: disabledInit,
  exposed: exposedInit,
  onLoad,
  onChange,
  onSubmit: onSubmitInit,
  onError,
}: FormOptions = {}) => {
  // Internal method
  const extractFieldValues = (fields: FieldsMap) =>
    Array.from(fields).map(([name, state]) => [name, state.value])

  // Internal method; values are calculated after fields
  const getValuesDeep = (newFields: FieldsMap) =>
    toDeepObject(Object.fromEntries(
      extractFieldValues(newFields).filter(([name]) => !name.startsWith('__config'))
    ))

  // Internal method; insert/replace new values in current fields
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
  
  const [fields, setFields] = useState<FieldsMap>(getFieldsMap(new Map(), defaultValues))
  const [values, setValuesRaw] = useState<KeyObject>(defaultValues)
  
  const [isValid, setValid] = useState(false)
  const [valuesLoading, setValuesLoading] = useState(isLoading ?? true)
  const [successCount, setSuccessCount] = useState(0)
  const [hasChanges, setHasChanges] = useState(false)

  const onEventProps = { fields, values, isValid, successCount }

  // User-facing method
  const setValues = (newValues: KeyObject, newModified?: boolean) =>
    setFields(curr => getFieldsMap(curr, newValues, newModified))

  // User-facing method
  const pushChanges = () => {
    setValues(Object.fromEntries(extractFieldValues(fields)), false)
    setHasChanges(false)
  }

  // Automatically passed to Form
  const onSubmit = !onSubmitInit ? null : async (e: any) => {
    if (e.preventDefault)
      e.preventDefault()
  
    setExposed(true)
  
    try {
      if (!isValid)
        throw Error('invalid')
  
      setDisabled(true)
      await onSubmitInit(onEventProps)
      setSuccessCount(curr => curr + 1)
    }
    catch (error: any) {
      setDisabled(false)
      if (onError) onError({ ...onEventProps, error })
    }
  }

  // Considered fully loaded when defaultValues and current values match
  useEffectWhile(() => {
    if (isLoading) return true
    if (objectHasValue(defaultValues) && (objectToURI(defaultValues) !== objectToURI(values))) return true
    
    if (onLoad)
      onLoad(onEventProps)

    setValuesLoading(false)
  }, [isLoading, stringify(values)])

  // Ensure changes are by user, not by reloading default values
  useEffect(() => {
    if (!hasChanges || !onChange) return
    onChange(onEventProps)
  }, [hasChanges, stringify(values)])

  // Recalculate default values
  useEffect(() => {
    if (defaultValues)
      setValues(defaultValues)
  }, [stringify(defaultValues)])

  // Recalculate values when fields change
  useEffect(() => {
    setValuesRaw(getValuesDeep(fields))
    setValid(Array.from(fields).every(([_, state]) => !state.error))

    if (!Array.from(fields).some(([_, state]) => state.modified)) return

    setHasChanges(true)
  }, [stringify(fields)])

  const context: FormState = {
    disabled, setDisabled,
    exposed, setExposed,
    fields, setFields,
    values, setValues,
    isValid, valuesLoading,
    hasChanges, pushChanges,
    onSubmit, successCount,
  }

  return { context, ...context }
}

export const FormContext = createContext<FormState | null>(null)

export const useFormContext = () => useContext(FormContext) ?? useForm()

export const useField = <T extends unknown>({
  name,
  value,
  disabled: disabledInit,
  validate = null,
  onChange,
}: {
  name: string
  value: T
  disabled?: boolean
  validate?: ((newValue: T) => boolean) | null
  onChange?: (newValue: T) => void
}) => {
  const { disabled: formDisabled, exposed: formExposed, fields, setFields } = useFormContext()

  const field = fields.get(name) ?? { value, modified: false, error: false }
  const valueClean = field.value as T
  const disabledClean = disabledInit ?? formDisabled
  const showError = field.error && (field.modified || formExposed)

  // User-facing method; also used by the component
  const setValue = (newValue: T, newModified = true) => {
    fields.set(name, {
      value: newValue,
      modified: newModified,
      error: validate ? !validate(newValue) : false,
      validate,
    })

    setFields(new Map(fields))
    if (onChange) onChange(newValue)
  }

  // Handle manual value control
  useEffect(() => setValue(value), [stringify(value)])

  // Set initial state and cleanup
  useEffect(() => {
    setValue(valueClean, false)

    return () => {
      fields.delete(name)
      setFields(new Map(fields))
    }
  }, [name])

  return { name, value: valueClean, setValue, disabled: disabledClean, showError }
}

export interface ModalOptions {
  ref?: any
  onChange?: (ref: any) => void
  openDelay?: number
  closeDelay?: number
  useListeners?: (ref: any) => void
}

export const useModal = (
  active: boolean,
  setActive: SetState<boolean>,
  options: ModalOptions = {}
) => {
  const {
    ref: refProp,
    onChange,
    openDelay,
    closeDelay,
    useListeners = () => {},
  } = options

  const ref = refProp || useRef()
  const timer = useRef<any>() 

  const setActiveTimer = (newActive: boolean, delay: number) =>
    timer.current = setTimeout(() => setActive(newActive), delay)

  useEffect(() => {
    if (openDelay)
      setActiveTimer(true, openDelay)
  }, [])

  useEffect(() => {
    clearTimeout(timer.current)

    if (onChange)
      onChange(ref)
      
    if (active && closeDelay)
      setActiveTimer(false, closeDelay)
  }, [active])

  useListeners(ref)

  return { ref }
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

export const useLightbox = (
  numItems: number,
  {
    index: indexInit,
    active: activeInit
  }: {
    index?: number
    active?: boolean
  } = {}
) => {
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