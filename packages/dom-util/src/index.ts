import { stringify } from '@fernui/util'

export const st = (selector: string, smooth?: boolean) =>
  (document.querySelector(selector) ?? document.body)
    .scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })

export const downloadFile = (content: string | object, name: string, type = 'text/plain') => {
  const link = document.createElement('a')
  const blob = new Blob([stringify(content)], { type })
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', name)
  link.click()
}

export const parseHTML = (str: string) => {
  const element = document.createElement('div')
  element.innerHTML = String(str).replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
  return element.textContent ?? ''
}

export const fileToBase64 = async (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject('')
  })

export const onIntersect = (
  selector: string,
  callback: (element: any) => any,
  options?: { offset?: string, fireOnce?: boolean }
) => {
  const { offset = '0px 0px 0px 0px', fireOnce = true } = options ?? {}

  document.querySelectorAll(selector).forEach(element => {
    (new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
          
        callback(entry.target)
        
        if (fireOnce) observer.disconnect()
      })
    }, { rootMargin: offset })).observe(element)
  })
}

export const initLazyLoad = (offset = '750px') => {
  const offsetStr = `${offset} ${offset} ${offset} ${offset}`

  onIntersect('[data-lazy-src]', (element: HTMLImageElement) => {
    element.src = element.dataset.lazySrc ?? ''
  }, { offset: offsetStr })

  onIntersect('[data-lazy-srcset]', (element: HTMLImageElement) => {
    element.srcset = element.dataset.lazySrcset ?? ''
  }, { offset: offsetStr })
}

export const initScrollView = (offset = '999999px 0px -25% 0px') => {
  onIntersect('.scroll-view', (element: HTMLElement) => {
    element.classList.add('scroll-view-active')
  }, { offset })
}

export const initWindowResizeAnnouncer = () => {
  window.addEventListener('resize', () => {
    window.dispatchEvent(new Event('windowresize', {
      bubbles: false,
      cancelable: false,
    }))
  })
}

export type Timestamp = { value: number }
export type TimelineCallbackProps = [time: Timestamp, root: Element | Document]
export type TimelineCallback<T> = (...props: TimelineCallbackProps) => T
export type TimelineEvent = [
  time: number,
  callback: TimelineCallback<number>,
  carryOn?: boolean,
]

export const initTimeline = (timeline: TimelineEvent[], sectionSelector?: string) => {
  let time = { value: 0 }

  ;(sectionSelector ? document.querySelectorAll(sectionSelector) : [document])
    .forEach(section => {
      timeline.forEach(event => {
        const [eventTime, callback, carryOn] = event

        time.value = carryOn ? (time.value + eventTime) : eventTime 
        time.value = callback(time, section)
      })
    })
}

export const createTimelineEvent = (
  callback: TimelineCallback<void>
) => (
  ...[time, root]: TimelineCallbackProps
) => {
  callback(time, root)
  return time.value
}

export const animDelay = (selector: string, step: number) =>
  createTimelineEvent((time, root) => {
    root.querySelectorAll(selector).forEach((element: any) => {
      element.style.animationDelay = `${time.value}ms`
      time.value += step
    })
    time.value -= step
  })

export const animLetters = (selector: string, step: number) =>
  createTimelineEvent((time, root) => {
    root.querySelectorAll(selector).forEach(textNode => {
      if (textNode.innerHTML.includes('split-letter-word')) return

      textNode.innerHTML = parseHTML(textNode.innerHTML.replace(/\s+/g, ' ').trim()).split(' ').map(word =>
        `<span class='split-letter-word' style='display: inline-flex;'>`
        + word.split('').map(letter => {
          const html = `<div class='split-letter' style='display: inline-block; animation-delay: ${time.value}ms'>${letter}</div>`
          time.value += step
          return html
        }).join('')
        + `</span>`
      ).join(' ')
    })
    time.value -= step
  })