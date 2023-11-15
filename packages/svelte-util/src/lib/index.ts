import { getContext, onMount } from 'svelte'
import { KeyObject, toDeepObject, cycle, objectHasValue, objectToURI } from '@fernui/util'

export type FieldState = {
  value: any
  modified: boolean
  error: boolean
  validate: ((newValue: any) => boolean) | null
}

export type FieldsMap = Map<string, FieldState>

export interface FormState {
  disabled: boolean
  exposed: boolean
  fields: FieldsMap
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

export const createForm = ({
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

  let disabled = $state(disabledInit ?? false)
  let exposed = $state(exposedInit ?? false)
  
  let fields = $state(getFieldsMap(new Map(), defaultValues))
  let values = $state(defaultValues)
  
  let isValid = $state(false)
  let valuesLoading = $state(isLoading ?? true)
  let successCount = $state(0)
  let hasChanges = $state(false)

  const onEventProps = { fields, values, isValid, successCount }

  // User-facing method
  const setValues = (newValues: KeyObject, newModified?: boolean) =>
    fields = getFieldsMap(fields, newValues, newModified)

  // User-facing method
  const pushChanges = () => {
    setValues(Object.fromEntries(extractFieldValues(fields)), false)
    hasChanges = false
  }

  // Automatically passed to Form
  const onSubmit = !onSubmitInit ? null : async (e: any) => {
    if (e.preventDefault)
      e.preventDefault()
  
    exposed = true
  
    try {
      if (!isValid)
        throw Error('invalid')
  
      disabled = true
      await onSubmitInit(onEventProps)
      successCount += 1
    }
    catch (error: any) {
      disabled = false
      if (onError) onError({ ...onEventProps, error })
    }
  }

  // Considered fully loaded when defaultValues and current values match
  $: if (valuesLoading && (1 || isLoading || values)) {
    if (isLoading) return
    if (objectHasValue(defaultValues) && (objectToURI(defaultValues) !== objectToURI(values))) return
    
    if (onLoad)
      onLoad(onEventProps)

    valuesLoading = false
  }

  // Ensure changes are by user, not by reloading default values
  $: if (1 || hasChanges || values) {
    if (!hasChanges || !onChange) return
    onChange(onEventProps)
  }

  // Recalculate default values
  $: if (1 || defaultValues) {
    if (defaultValues)
      setValues(defaultValues)
  }

  // Recalculate values when fields change
  $: if (1 || fields) {
    values = getValuesDeep(fields)
    isValid = Array.from(fields).every(([_, state]) => !state.error)

    if (!Array.from(fields).some(([_, state]) => state.modified)) return

    hasChanges = true
  }

  const context: FormState = {
    disabled,
    exposed,
    fields,
    values, setValues,
    isValid, valuesLoading,
    hasChanges, pushChanges,
    onSubmit, successCount,
  }

  return { context, ...context }
}

export const getFormContext = (): FormState => getContext('form') ?? createForm()

export const createField = <T extends unknown>({
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
  let { disabled: formDisabled, exposed: formExposed, fields } = getFormContext()

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

    fields = fields
    if (onChange) onChange(newValue)
  }

  // Set initial state and cleanup
  $: if (1 || name) {
    setValue(valueClean, false)

    return () => {
      fields.delete(name)
      fields = fields
    }
  }

  return { name, value: valueClean, setValue, disabled: disabledClean, showError }
}

export interface ModalOptions {
  el?: any
  onChange?: (ref: any) => void
  openDelay?: number
  closeDelay?: number
  useListeners?: (ref: any) => void
}

export const createModal = (
  active: boolean,
  options: ModalOptions = {}
) => {
  const {
    el: elProp,
    onChange,
    openDelay,
    closeDelay,
    useListeners = () => {},
  } = options

  let el = elProp
  let timer: any

  const setActiveTimer = (newActive: boolean, delay: number) =>
    timer = setTimeout(() => active = newActive, delay)

  onMount(() => {
    if (openDelay)
      setActiveTimer(true, openDelay)
  })

  $: if (1 || active) {
    clearTimeout(timer)

    if (onChange)
      onChange(el)
      
    if (active && closeDelay)
      setActiveTimer(false, closeDelay)
  }

  useListeners(el)

  return el
}

export const createRepeater = <T>(initialItems: T[] = []) => {
  let key = 0
  let items: [number, T][] = initialItems.map(item => [key++, item])

  const insert = (item: T, newIndex?: number) => {
    if (newIndex === undefined || newIndex < 0 || newIndex >= items.length)
      items.push([key++, item])
    else
      items.splice(newIndex, 0, [key++, item])

    items = items
  }

  const remove = (index?: number) => {
    if (index === undefined || index < 0 || index > items.length - 1)
      items.pop()
    else
      items.splice(index, 1)
    
    items = items
  }

  const update = (newItem: T | ((currentValue: T) => T), index: number) => {
    if (index < 0 || index >= items.length)
      return

    items[index][1] = typeof newItem === 'function'
      ? (newItem as any)(items[index][1])
      : newItem

    items = items
  }

  const reset = (newItems: T[]) =>
    items = newItems.map(item => [key++, item])

  return { items, insert, remove, update, reset }
}

export interface LightboxControl {
  index: number
  active: boolean
  open: (newIndex: number) => void
  previous: () => void
  next: () => void
}

export const createLightbox = (
  numItems: number,
  {
    index: indexInit,
    active: activeInit
  }: {
    index?: number
    active?: boolean
  } = {}
) => {
  let index = indexInit ?? 0
  let active = activeInit ?? false

  const open = (newIndex: number) => {
    index = newIndex
    active = true
  }

  const previous = () => {
    index = cycle(numItems, index, -1)
    active = true
  }

  const next = () => {
    index = cycle(numItems, index, 1)
    active = true
  }

  const control: LightboxControl = { index, active, open, previous, next }

  return { control, ...control }
}