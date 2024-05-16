import React, { useEffect, useRef, useState, Dispatch, SetStateAction, createContext, useContext } from 'react'
import { getUniqueFileName, KeyObject, objectToUri, toArray, uriToObject, toDeepObject, cycle } from '@fernui/util'
import { fileToBase64 } from '@fernui/dom-util'

export type SetState<T> = Dispatch<SetStateAction<T>>

export const useDebounce = ({
  callback,
  delayMilliseconds,
  dependencies,
  skipFirstDebounce: skipFirstDebounceProp,
}: {
  callback: () => any
  delayMilliseconds: number
  dependencies: any[]
  skipFirstDebounce?: boolean
}) => {
  const skipFirstDebounce = useRef(skipFirstDebounceProp ?? false)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let timeoutId: any

    (async () => {
      if (skipFirstDebounce.current) {
        skipFirstDebounce.current = false
        await callback()
        return setLoading(false)
      }
  
      setLoading(true)
  
      timeoutId = setTimeout(async () => {
        await callback()
        setLoading(false)
      }, delayMilliseconds)
    })()

    return () => clearTimeout(timeoutId)
  }, [...dependencies, delayMilliseconds])

  return isLoading
}

export const useThrottle = ({
  callback,
  delayMilliseconds,
  dependencies,
}: {
  callback: () => any
  delayMilliseconds: number
  dependencies: any[]
}) => {
  const lastRanTimestamp = useRef(0)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let timeoutId: any
  
    (async () => {
      const runCallback = async () => {
        lastRanTimestamp.current = new Date().getTime()
        await callback()
        setLoading(false)
      }
    
      const elapsedMilliseconds = new Date().getTime() - lastRanTimestamp.current
      const remainingMilliseconds = delayMilliseconds - elapsedMilliseconds
  
      clearTimeout(timeoutId)
  
      if (remainingMilliseconds <= 0)
        await runCallback()
      else
        timeoutId = setTimeout(runCallback, remainingMilliseconds)
    })()

    return () => clearTimeout(timeoutId)
  }, [...dependencies, delayMilliseconds])

  return isLoading
}

export type FieldState = {
  value: any
  modified: boolean
  validate: (newValue: any) => boolean
  error: boolean
}

export type NewFieldState<T> = {
  value: T
  modified?: boolean
  validate?: ((newValue: T) => boolean)
}

export type SetFieldState = <T>(name: string, state: NewFieldState<T>, triggerUpdate?: boolean) => void

export type FieldsMap = Map<string, FieldState>

export interface FormState {
  disabled: boolean
  setDisabled: SetState<boolean>
  exposed: boolean
  setExposed: SetState<boolean>
  fields: FieldsMap
  setFields: (newValue: FieldsMap) => void
  resetFields: (resetModifiedAndExposed?: boolean) => void
  setField: SetFieldState
  removeField: (name: string) => void
  values: KeyObject
  isValid: boolean
  hasChanges: { current: boolean }
  pushChanges: (newValues?: KeyObject) => void
  onSubmit: ((e: any) => Promise<void>) | null
  successCount: number
}

export type FormOnChangeProps = Pick<FormState, 'fields' | 'values' | 'isValid' | 'pushChanges'>

export interface FormOptions {
  defaultValues?: KeyObject
  defaultDisabled?: boolean
  defaultExposed?: boolean
  promptBeforeUnload?: boolean
  onChange?: (newState: FormOnChangeProps) => any
  onSubmit?: () => any
  onError?: (error: any) => any
}

export const useForm = ({
  defaultValues = {},
  defaultDisabled,
  defaultExposed,
  promptBeforeUnload,
  onChange,
  onSubmit: onSubmitProp,
  onError,
}: FormOptions = {}) => {
  const defaultFieldState = { modified: false, validate: () => true, error: false }

  const [disabled, setDisabled] = useState(defaultDisabled ?? false)
  const [exposed, setExposed] = useState(defaultExposed ?? false)
  
  const [fields, setFields] = useState<FieldsMap>(new Map(
    Object.entries(defaultValues).map(([name, value]) => [name, { ...defaultFieldState, value }])
  ))
  const [values, setValues] = useState<KeyObject>(defaultValues)
  const savedValuesString = useRef(objectToUri(defaultValues))
  
  const [isValid, setValid] = useState(false)
  const hasChanges = useRef(false)
  const [successCount, setSuccessCount] = useState(0)

  // User-facing method
  const setFieldsAndUpdateValues = (newFields: FieldsMap, forceChange = false) => {
    const newValid = Array.from(newFields).every(([_, state]) => !state.error)
    const newValues = toDeepObject(Object.fromEntries(
      Array.from(newFields)
        .map(([name, state]) => [name, state.value])
        .filter(([name]) => !name.startsWith('__config'))
    ))

    const newHasChanges = Array.from(newFields).some(([_, state]) => state.modified)
      && objectToUri(newValues) !== savedValuesString.current

    setFields(newFields)
    setValid(newValid)
    setValues(newValues)
    hasChanges.current = newHasChanges

    // Subscription callbacks are more efficient than useEffect
    if (onChange && (newHasChanges || forceChange))
      onChange({
        fields: newFields,
        values: newValues,
        isValid: newValid,
        pushChanges: () => pushChanges(newValues),
      })
  }

  // User-facing method
  const pushChanges = (newValues?: KeyObject) => {
    savedValuesString.current = objectToUri(newValues ?? values)
    hasChanges.current = false
  }

  // User-facing method
  const resetFields = (resetModifiedAndExposed = true) => {
    if (resetModifiedAndExposed) setExposed(false)

    setFieldsAndUpdateValues(new Map(
      Array.from(fields)
        .map(([name, state]) => [name, {
          value: '',
          modified: !resetModifiedAndExposed,
          validate: state.validate,
          error: !state.validate(''),
        }])
    ), true)
  }

  // User-facing method
  const setField: SetFieldState = (
    name,
    { value, modified = true, validate: validateProp },
    triggerUpdate = true
  ) => {
    const validate = validateProp ?? (fields.get(name) ?? {}).validate ?? (() => true)

    fields.set(name, {
      value,
      modified,
      validate,
      error: !validate(value),
    })

    if (triggerUpdate)
      setFieldsAndUpdateValues(new Map(fields))
  }

  // User-facing method
  const removeField = (name: string) => {
    const defaultValue = defaultValues[name]
    const validate = (fields.get(name) ?? {}).validate ?? (() => true)

    if (defaultValue)
      fields.set(name, {
        value: defaultValue,
        modified: false,
        validate,
        error: !validate(defaultValue),
      })
    else
      fields.delete(name)

    setFieldsAndUpdateValues(new Map(fields))
  }

  // Automatically passed to Form
  const onSubmit = !onSubmitProp ? null : async (e: any) => {
    if (e.preventDefault) e.preventDefault()
    if (disabled) return

    setExposed(true)
  
    try {
      if (!isValid)
        throw Error('invalid')
  
      await onSubmitProp()
      setSuccessCount(curr => curr + 1)
    }
    catch (error: any) {
      if (onError) onError(error)
    }
  }

  useListener('beforeunload', (e: any) => {
    if (promptBeforeUnload && hasChanges.current) {
      e.preventDefault()
      e.returnValue = ''
    }
  })

  const context: FormState = {
    disabled, setDisabled,
    exposed, setExposed,
    fields, setFields: setFieldsAndUpdateValues, resetFields,
    setField, removeField,
    values, isValid,
    hasChanges, pushChanges,
    onSubmit, successCount,
  }

  return { context, ...context }
}

export const FormContext = createContext<FormState | null>(null)

export const useFormContext = () => useContext(FormContext) ?? useForm()

export const useField = <T>({
  context,
  name,
  defaultValue,
  disabled: disabledProp,
  validate,
  onChange,
}: {
  context?: FormState
  name: string
  defaultValue: T
  disabled?: boolean
  validate?: (newValue: T) => boolean
  onChange?: (newValue: T) => any
}) => {
  const { disabled: formDisabled, exposed: formExposed, fields, setField, removeField } = context ?? useFormContext()

  const field = fields.get(name) ?? { value: defaultValue, modified: false, error: false }
  const valueClean = field.value as T
  const disabledClean = disabledProp ?? formDisabled
  const showError = field.error && (field.modified || formExposed)

  // User-facing method; should be used by component
  const setValue = (newValue: T, newModified = true) => {
    setField(name, { value: newValue, modified: newModified, validate })
    if (onChange) onChange(newValue)
  }

  // Set default state and cleanup
  useEffect(() => {
    setValue(valueClean, false)
    return () => removeField(name)
  }, [name])

  return { name, value: valueClean, setValue, disabled: disabledClean, showError }
}

export const useModal = (
  active: boolean,
  setActive: SetState<boolean>,
  {
    ref: refProp,
    onChange,
    openDelayMilliseconds,
    closeDelayMilliseconds,
    exitOnOutsideClick,
    exitOnEscape,
    preventScroll,
  }: {
    ref?: any
    onChange?: (ref: any) => void
    openDelayMilliseconds?: number
    closeDelayMilliseconds?: number
    exitOnOutsideClick?: boolean
    exitOnEscape?: boolean
    preventScroll?: boolean
  } = {}
) => {
  const ref = refProp || useRef()
  const timer = useRef<any>()

  const setActiveTimer = (newActive: boolean, delayMilliseconds: number) =>
    timer.current = setTimeout(() => setActive(newActive), delayMilliseconds)

  useEffect(() => {
    if (openDelayMilliseconds)
      setActiveTimer(true, openDelayMilliseconds)
  }, [])

  useEffect(() => {
    clearTimeout(timer.current)

    if (preventScroll && document)
      document.body.style.overflow = active ? 'hidden' : 'auto'

    if (onChange)
      onChange(ref)
      
    if (active && closeDelayMilliseconds)
      setActiveTimer(false, closeDelayMilliseconds)
  }, [active])

  useListener('keydown', (e: any) => {
    if (active && !e.repeat && exitOnEscape && e.key && e.key.toLowerCase() === 'escape')
      setActive(false)
  })

  useListener('mouseup', (e: any) => {
    if (active && exitOnOutsideClick && !e.target.closest('.fui-modal-outer') && !ref.current.contains(e.target))
      setTimeout(() => setActive(false), 0)
  })

  return { ref }
}

export const useRepeater = <T>(defaultItems: T[] = []) => {
  const index = useRef(0)

  const getKey = () =>
    index.current++

  const [items, setItems] = useState<[number, T][]>(
    defaultItems.map(item => [getKey(), item])
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
    index: indexProp,
    active: activeProp
  }: {
    index?: number
    active?: boolean
  } = {}
) => {
  const [index, setIndex] = useState(indexProp ?? 0)
  const [active, setActive] = useState(activeProp ?? false)

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

export const useListener = (
  event: string,
  callback: Function,
  {
    element,
    dependencies,
    ...eventListenerProps
  }: {
    element?: any
    dependencies?: any[]
    [eventListenerProps: string]: any
  } = {}
) => {
  useEffect(() => {
    const root = element === 'document' ? document
      : element ? (element.current || element)
      : window
    
    root.addEventListener(event, callback, eventListenerProps)
    return () => root.removeEventListener(event, callback, eventListenerProps)
  }, [event, callback, ...dependencies ?? []])
}

export const useLocalStorage = (key: string, fallbackValue?: string) => {
  const [value, setValue] = useState(fallbackValue)
  const isLoading = useRef(true)

  useEffect(() => {
    const loadedValue = localStorage.getItem(key)
    setValue(loadedValue ?? fallbackValue ?? '')
    isLoading.current = false
  }, [])

  const setValueAndStore = (newValue: string) => {
    if (isLoading.current) return
    localStorage.setItem(key, newValue)
    setValue(newValue)
  }

  return [value, setValueAndStore] as const
}

export const useScreen = (mode: 'min' | 'max' = 'min') => {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xl2: 1536,
  }
  
  const [screen, setScreenRaw] = useState({
    width: 0,
    height: 0,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xl2: false,
    '2xl': false,
  })

  const setScreen = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    setScreenRaw({
      width,
      height,
      sm: (mode === 'max') === (width < breakpoints.sm),
      md: (mode === 'max') === (width < breakpoints.md),
      lg: (mode === 'max') === (width < breakpoints.lg),
      xl: (mode === 'max') === (width < breakpoints.xl),
      xl2: (mode === 'max') === (width < breakpoints.xl2),
      '2xl': (mode === 'max') === (width < breakpoints.xl2),
    })
  }

  useListener('windowresize', setScreen)
  useEffect(setScreen, [])

  return screen
}

export const useWindowResizeAnnouncer = () => {
  useListener('resize', () => {
    window.dispatchEvent(new Event('windowresize', {
      bubbles: false,
      cancelable: false
    }))
  })
}

export const useRefresh = <T>({
  defaultValue,
  callback,
  interval = 60000,
  onSuccess,
  onError,
}: {
  defaultValue: T
  callback: (currentValue: T) => T | Promise<T>
  interval?: number
  onSuccess?: (newValue: T, oldValue: T) => any
  onError?: (error: any) => any
}): T => {
  const [data, setData] = useState(defaultValue)
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
    catch (error) {
      if (onError)
        onError(error)
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

export const useUrl = (dependencies?: any[]) => {
  const [urlData, setUrlData] = useState({
    query: {},
    protocol: '',
    host: '',
    pathname: '',
    search: '?',
    hash: '',
    referrer: '',
  })

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setUrlData({
      query: uriToObject(window.location.search),
      protocol: window.location.protocol,
      host: window.location.host,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      referrer: document.referrer,
    })
  }, [...(dependencies ?? [])])

  useEffect(() => {
    if (urlData.host === window.location.host)
      setLoading(false)
  }, [urlData])

  return [location, isLoading] as const
}

export const useBreadcrumbs = (excludeIndexes: number[] = []) => {
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])

  useEffect(() => {
    const parts = window.location.pathname.split('/').slice(1)

    setBreadcrumbs(
      parts
        .map((_, i) => '/' + parts.slice(0, i + 1).join('/'))
        .filter((_, i) => !excludeIndexes.includes(i))
    )
  }, [])

  return breadcrumbs
}

export const jsxToText = (element: React.ReactElement | string): string => {
  if (!element) return ''
  if (typeof element === 'string') return element.trim()

  const children = element.props && element.props.children

  if (Array.isArray(children))
    return children.map(jsxToText).filter(Boolean).join(' ')

  return jsxToText(children)
}

export const getButtonRoleProps = ({
  label,
  tabIndex,
  disabled
}: {
  label?: string
  tabIndex?: number
  disabled?: boolean
} = {}) => ({
  role: 'button',
  ...label && { 'aria-label': label },
  tabIndex: tabIndex ?? 0,
  'aria-disabled': disabled ?? false,
  style: { cursor: disabled ? 'auto' : 'pointer' },
  onKeyDown: (e: any) => {
    if (['Enter', 'Spacebar', ' '].indexOf(e.key) >= 0) {
      e.preventDefault()
      e.stopPropagation()
      e.target.click()
    }
  },
})

export type FormValue = [name: string, value: any]

export interface UploadFile {
  name: string
  data: string
}

export const splitFormValuesAndFiles = async (values: KeyObject, uploadURL: string) => {
  const valuesArray: FormValue[] = Object.entries(structuredClone(values))
  const files: UploadFile[] = []

  await Promise.all(
    valuesArray.map(([_, value], i) =>
      toArray(value)
        .filter(v => v instanceof File)
        .map(async (file, j) => {
          const name = getUniqueFileName(file.name, j)
          valuesArray[i][1][j] = uploadURL + name
          files.push({ name, data: await fileToBase64(file) })
        })
    ).flat()
  )

  return [valuesArray, files] as const
}