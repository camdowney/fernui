import React, { useEffect, useRef, useState } from 'react'
import { KeyObject, objectToURI, uriToObject } from '@fernui/util'
import { initLazyLoad, initScrollView, initSplitLetters } from '@fernui/dom-util'
import { SetState } from '@fernui/react-core-util'

export const useListener = (
  event: string,
  callback: Function,
  options?: {
    element?: any
    dependencies?: any[]
    [props: string]: any
  }
) => {
  const { element, dependencies, ...rest } = options ?? {}

  useEffect(() => {
    const root = element === 'document' ? document
      : element ? (element.current || element)
      : window
    
    root.addEventListener(event, callback, rest)
    return () => root.removeEventListener(event, callback, rest)
  }, [event, callback, ...(dependencies ?? [])])
}

export const useLocalStorage = <T extends unknown>(key: string, fallbackValue: T) => {
  const [data, setData] = useState<T>(fallbackValue)
  const loaded = useRef(false)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored) setData(JSON.parse(stored))
    loaded.current = true
  }, [])

  const setDataAndStore = (newValue: T) => {
    if (!loaded.current) return
    localStorage.setItem(key, JSON.stringify(newValue))
    setData(newValue)
  }

  return [data, setDataAndStore] as const
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

export const useModal = (
  active: boolean,
  setActive: SetState<boolean>,
  options?: {
    ref?: any
    openDelay?: number
    closeDelay?: number
    exitOnOutsideClick?: boolean
    exitOnEscape?: boolean
    preventScroll?: boolean
  }
) => {
  const {
    ref: refProp,
    openDelay,
    closeDelay,
    exitOnOutsideClick,
    exitOnEscape,
    preventScroll
  } = options ?? {}

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

    if (preventScroll && document)
      document.body.style.overflow = active ? 'hidden' : 'auto'
      
    if (active && closeDelay)
      setActiveTimer(false, closeDelay)
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

export const useURL = (options: {
  dependencies?: any[]
  onLoad?: ({ query, search }: { query: KeyObject, search: string }) => void
} = {}) => {
  const { dependencies = [], onLoad } = options ?? {}

  const [query, setQuery] = useState<KeyObject>({})
  const [search, setSearch] = useState('?')
  const [referrer, setReferrer] = useState('')
  const [isLoading, setLoading] = useState(true)

  const loadQuery = () => {
    const newSearch = window.location.search
    const newQuery = uriToObject(newSearch)
    
    if (onLoad)
      onLoad({ query: newQuery, search: newSearch })

    setQuery(newQuery)
    setSearch(newSearch)
  }

  useEffect(loadQuery, dependencies)

  useEffect(() => setReferrer(document.referrer), [])

  useEffect(() => {
    if (search === window.location.search && referrer === document.referrer)
      setLoading(false)
  }, [search, referrer])

  const push = (queryOrSearch: KeyObject | string, refresh = false) => {
    if (typeof window === 'undefined') return

    const query = typeof queryOrSearch === 'object'
      ? queryOrSearch
      : uriToObject(queryOrSearch)

    window.history.pushState(query, '', `?${objectToURI(query)}`)

    if (refresh)
      loadQuery()
  }

  return { query, search, referrer, push, isLoading }
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
  ...(options.label && { 'aria-label': options.label }),
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

export const useLazyLoad = (offset?: string) =>
  useEffect(() => initLazyLoad(offset), [])

export const useScrollView = (offset?: string) =>
  useEffect(() => initScrollView(offset), [])

export const useSplitLetters = (selector: string, delay?: number, step?: number) =>
  useEffect(() => initSplitLetters(selector, delay, step), [])