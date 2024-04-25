import React, { useEffect, useRef, useState } from 'react'
import { getUniqueFileName, KeyObject, objectToUri, toArray, uriToObject } from '@fernui/util'
import { fileToBase64, initLazyLoad } from '@fernui/dom-util'
import { ModalOptions, SetState, useComplexState, useModal as useModalInit } from '@fernui/react-core-util'

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

export interface ModalDomOptions extends ModalOptions {
  exitOnOutsideClick?: boolean
  exitOnEscape?: boolean
  preventScroll?: boolean
}

export const useModal = (
  active: boolean,
  setActive: SetState<boolean>,
  options: ModalDomOptions = {}
) => {
  const {
    onChange,
    useListeners,
    exitOnOutsideClick,
    exitOnEscape,
    preventScroll,
    ...rest
  } = options

  return useModalInit(active, setActive, {
    ...rest,
    onChange: ref => {
      if (preventScroll && document)
        document.body.style.overflow = active ? 'hidden' : 'auto'

      if (onChange)
        onChange(ref)
    },
    useListeners: ref => {
      useListener('keydown', (e: any) => {
        if (active && !e.repeat && exitOnEscape && e.key && e.key.toLowerCase() === 'escape')
          setActive(false)
      })
    
      useListener('mouseup', (e: any) => {
        if (active && exitOnOutsideClick && !e.target.closest('.fui-modal-outer') && !ref.current.contains(e.target))
          setTimeout(() => setActive(false), 0)
      })

      if (useListeners)
        useListeners(active)
    },
  })
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

export const useUrl = (options: { dependencies?: any[]} = {}) => {
  const { dependencies = [] } = options

  const [query, setQuery] = useState<KeyObject>({})
  const [protocol, setProtocol] = useState('')
  const [host, setHost] = useState('')
  const [path, setPath] = useState('')
  const [search, setSearch] = useState('?')
  const [hash, setHash] = useState('')
  const [referrer, setReferrer] = useState('')
  const [isLoading, setLoading] = useState(true)

  // Set all values excluding referrer
  const setAll = () => {
    setQuery(uriToObject(window.location.search))
    setProtocol(window.location.protocol)
    setHost(window.location.host)
    setPath(window.location.pathname)
    setSearch(window.location.search)
    setHash(window.location.hash)
  }

  // Watch deps
  useEffect(setAll, dependencies)

  // Init referrer
  useEffect(() => setReferrer(document.referrer), [])

  // Considered loaded when values match window & document
  useEffect(() => {
    if (host === window.location.host && referrer === document.referrer)
      setLoading(false)
  }, [search, referrer])

  // Push query or search params, refresh will update state
  const push = (queryOrSearch: KeyObject | string, refresh = false) => {
    if (typeof window === 'undefined') return

    const query = typeof queryOrSearch === 'object'
      ? queryOrSearch
      : uriToObject(queryOrSearch)

    window.history.pushState(query, '', `?${objectToUri(query)}`)

    if (refresh) setAll()
  }

  return { query, protocol, host, path, search, hash, referrer, push, isLoading }
}

export const useBreadcrumbs = (excludePages: number[] = []) => {
  const [breadcrumbs] = useComplexState({
    callback: () => {
      const parts = window.location.pathname.split('/').slice(1)

      return parts
        .map((_, i) => '/' + parts.slice(0, i + 1).join('/'))
        .filter((_, i) => !excludePages.includes(i))
    },
    defaultValue: [],
  })

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

export const buttonRoleProps = (options: { label?: string, tabIndex?: number, disabled?: boolean } = {}) => ({
  role: 'button',
  ...options.label && { 'aria-label': options.label },
  tabIndex: options.tabIndex ?? 0,
  'aria-disabled': options.disabled ?? false,
  style: { cursor: options.disabled ? 'auto' : 'pointer' },
  onKeyDown: (e: any) => {
    if (['Enter', 'Spacebar', ' '].indexOf(e.key) >= 0) {
      e.preventDefault()
      e.stopPropagation()
      e.target.click()
    }
  },
})

export interface UploadData {
  name: string
  data: string
}

export const destructFormValuesAndFiles = async (valuesInit: KeyObject, uploadURL: string) => {
  const values = Object.entries(structuredClone(valuesInit))
  const files: UploadData[] = []

  await Promise.all(
    values.map(([_, value], i) =>
      toArray(value)
        .filter(v => v instanceof File)
        .map(async (file, j) => {
          const name = getUniqueFileName(file.name, j)
          values[i][1][j] = uploadURL + name
          files.push({ name, data: await fileToBase64(file) })
        })
    ).flat()
  )

  return { values, files }
}

export const createLazyResizer = ({
  outputDir,
  noResizeSrcPatterns = [],
  sizes = [640, 1024, 1536, 2000],
  placeholderSize = 40,
  scale = 1,
}: {
  outputDir: string
  noResizeSrcPatterns?: RegExp[]
  sizes?: number[]
  placeholderSize?: number
  scale?: number
}) => {
  const getResizeSrc = (src: string, element?: HTMLImageElement) => {
    if ([...noResizeSrcPatterns, /^http/].some(pattern => src.match(pattern)))
      return src
  
    const sizeRendered = element ? Math.max(element.scrollWidth, element.scrollHeight) : Infinity
    const sizeAdjusted = sizeRendered * scale
    const sizeClean = sizes.find(size => sizeAdjusted < size) ?? sizes.slice(-1)
  
    return `${outputDir}/${sizeClean}${src}`
  }

  return {
    /**
     * Returns the most optimally-sized image for an element from an existing folder of resized images.
     * @param src (string) Should match an existing resized image given the structure /[outputDir]/[size]/[src]
     * @param element (HTMLImageElement?) If undefined, the largest available image will be returned.
     */
    getResizeSrc,
    /**
     * Attaches scroll listeners to all existing Images prepared by getLazyResizeImageProps.
     */
    initLazyResize: () => initLazyLoad({ transformSrc: getResizeSrc }),
    /**
     * Allows Image components to be lazy-loaded and resized; requires initLazyResize to have been run.
     * @param src (string) Should match an existing resized image given the structure /[outputDir]/[size]/[src]
     * @param lazy (boolean?) If not true, the largest available image will be immediately loaded.
     */
    getLazyResizeImageProps: (src = '', lazy?: boolean) =>
      lazy ? {
        placeholderStyle: {
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${outputDir}/${placeholderSize}${src}) !important`,
        },
        innerProps: {
          'data-lazy-bg': src,
          'data-lazy-loaded': false,
        },
      }
      : {
        src: getResizeSrc(src),
      },
  }
}