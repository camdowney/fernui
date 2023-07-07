import { useEffect, useRef } from 'react'
import { SetState, escapeHtml } from '@fernui/react-core-util'

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
  useEffect(() => {
    const current = options?.element?.current || options?.element || window
    
    current.addEventListener(event, callback, options?.rest)
    return () => current.removeEventListener(event, callback, options?.rest)
  }, [event, callback, ...(options?.dependencies ?? [])])
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
    if (active && !e.repeat && exitOnEscape && e?.key?.toLowerCase() === 'escape')
      setActive(false)
  })

  useListener('mouseup', (e: any) => {
    if (active && exitOnOutsideClick && !e.target.closest('.fui-modal-outer') && !ref.current.contains(e.target))
      setTimeout(() => setActive(false), 0)
  })

  return { ref }
}

export const ss = (selector: string) => () =>
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })

export const cn = (...classes: any[]) =>
  classes.filter(Boolean).join(' ')

export const formKeyValuesToHtml = (formKeyValues: [any, any][], heading = 'Form Submission') => {
  let html = heading ? `<h3 style='margin: 0 0 12px 0;'>${heading}</h3> ` : ''

  html += `<ul style='padding: 0 0 0 24px; margin: 0;'>`

  formKeyValues
    .filter(([_name]) => !_name.startsWith('__config'))
    .forEach(([_name, _value]) => {
      const name = escapeHtml(_name.replace(/\*/g, ''))
      const value = _value === true ? 'Yes' : _value === false ? 'No' : escapeHtml(_value)

      html += `<li style='margin: 0 0 12px 0;'><span style='font-weight: bold;'>${name}:</span> <br>${value}</li>`
    })

  return html + '</ul>'
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
  })
}