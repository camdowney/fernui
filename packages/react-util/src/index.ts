import React, { useEffect, useRef, useState } from 'react'
import { SetState } from '@fernui/react-core-util'

export * from '@fernui/react-core-util'

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

export const useScreens = (mode: 'min' | 'max' = 'min') => {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xl2: 1536,
  }
  
  const [screens, setScreensInit] = useState({
    'sm': false,
    'md': false,
    'lg': false,
    'xl': false,
    'xl2': false,
    '2xl': false,
  })

  const setScreens = () => {
    const w = window.innerWidth

    setScreensInit({
      'sm': (mode === 'max') === (w < breakpoints.sm),
      'md': (mode === 'max') === (w < breakpoints.md),
      'lg': (mode === 'max') === (w < breakpoints.lg),
      'xl': (mode === 'max') === (w < breakpoints.xl),
      'xl2': (mode === 'max') === (w < breakpoints.xl2),
      '2xl': (mode === 'max') === (w < breakpoints.xl2),
    })
  }

  useListener('windowresize', () => setScreens())
  useEffect(() => setScreens(), [])

  return screens
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
  } = options || {}

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

export const st = (selector: string, smooth?: boolean) =>
  (document.querySelector(selector) ?? document.body)
    .scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })

export const cn = (...classes: (string | { [key: string]: string } | any)[]) => {
  let classesStr = ''

  classes.filter(Boolean).forEach(_class => {
    if (typeof _class === 'string')
      return classesStr += _class + ' '

    Object.entries(_class)
      .filter(([key, value]) => Boolean(value) && !classesStr.includes(key))
      .forEach(([_, value]) => classesStr += value + ' ')
  })

  return classesStr.trim()
}

export const downloadFile = (content: string | object, name: string, type = 'text/plain') => {
  const a = document.createElement('a')
  const blob = new Blob([typeof content === 'string' ? content : JSON.stringify(content)], { type })
  const url = URL.createObjectURL(blob)

  a.setAttribute('href', url)
  a.setAttribute('download', name)
  a.click()
}

export const JSXToText = (element: React.ReactElement | string): string => {
  if (!element) return ''
  if (typeof element === 'string') return element.trim()

  const children = element.props && element.props.children

  if (Array.isArray(children))
    return children.map(JSXToText).filter(Boolean).join(' ')

  return JSXToText(children)
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

export const onIntersect = (
  selector: string,
  callback: (element: any) => any,
  options?: { offset?: string, once?: boolean }
) => {
  const { offset = '0px 0px 0px 0px', once = true } = options || {}

  document.querySelectorAll(selector).forEach(element => {
    (new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
          
        callback(entry.target)
        
        if (once) observer.disconnect()
      })
    }, { rootMargin: offset })).observe(element)
  })
}

export const useLazyLoad = (offset = '750px') => {
  useEffect(() => {
    const offsetStr = `${offset} ${offset} ${offset} ${offset}`
  
    onIntersect('[data-lazy-src]', (element: HTMLImageElement) => {
      element.src = element.dataset.lazySrc ?? ''
    }, { offset: offsetStr })
  
    onIntersect('[data-lazy-srcset]', (element: HTMLImageElement) => {
      element.srcset = element.dataset.lazySrcset ?? ''
    }, { offset: offsetStr })
  }, [])
}

export const useScrollView = (offset = '999999px 0px -25% 0px') => {
  useEffect(() => {
    onIntersect('.scroll-view', (element: HTMLElement) => {
      element.classList.add('scroll-view-active')
    }, { offset })
  }, [])
}

export const useSplitLetters = (selector: string, delay = 0, step = 25) => {
  useEffect(() => {
    document.querySelectorAll(selector).forEach(element => {
      let letterIndex = 0
  
      element.innerHTML = element.innerHTML.split(' ').map(word =>
        '<span class="split-letter-word" style="display: inline-flex;">'
        + word.split('').map(letter => 
          `<div class="split-letter" style="display: inline-block; animation-delay: ${letterIndex++ * step + delay}ms">${letter}</div>`
        ).join('')
        + '</span>'
      ).join(' ')
  
      element.classList.add('split-letter-active')
    })
  }, [])
}