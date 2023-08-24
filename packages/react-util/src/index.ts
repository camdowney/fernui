import { useEffect, useRef, useState } from 'react'
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

export const useLocalStorage = <T>(key: string, fallbackValue: T) => {
  const [data, _setData] = useState<T>(fallbackValue)
  const loaded = useRef(false)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored) _setData(JSON.parse(stored))
    loaded.current = true
  }, [])

  const setData = (newValue: T) => {
    if (!loaded.current) return
    localStorage.setItem(key, JSON.stringify(newValue))
    _setData(newValue)
  }

  return [data, setData] as const
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
  const { ref: _ref, openDelay, closeDelay, exitOnOutsideClick, exitOnEscape, preventScroll } = options || {}

  const ref = _ref || useRef()
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

export const sv = (selector: string, smooth: boolean) =>
  (document.querySelector(selector) ?? document.body)
    .scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })

export const cn = (...classes: (string | { [key: string]: string } | any)[]) => {
  let classesStr = ''

  classes.filter(Boolean).forEach(_class => {
    if (typeof _class === 'string')
      return classesStr += _class + ' '

    Object.entries(_class)
      .filter(([key]) => !classesStr.includes(key))
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

export const JSXtoText = (element: React.ReactElement | string): string => {
  if (!element) return ''
  if (typeof element === 'string') return element

  const children = element.props && element.props.children

  if (Array.isArray(children))
    return children.map(JSXtoText).join(' ')

  return JSXtoText(children)
}

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

export const initLazyLoad = (offset = '750px') => {
  const _offset = `${offset} ${offset} ${offset} ${offset}`

  onIntersect('[data-lazy-src]', (element: HTMLImageElement) => {
    element.src = element.dataset.lazySrc ?? ''
  }, { offset: _offset })

  onIntersect('[data-lazy-srcset]', (element: HTMLImageElement) => {
    element.srcset = element.dataset.lazySrcset ?? ''
  }, { offset: _offset })
}

export const initScrollView = (offset = '999999px 0px -25% 0px') =>
  onIntersect('.scroll-view', (element: HTMLElement) => {
    element.classList.add('scroll-view-active')
  }, { offset })

export const initSplitLetters = (selector: string, delay = 0, step = 25) => {
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
}