export const ss = (selector: string) => () =>
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })

export const cn = (...classes: any[]) =>
  classes.filter(Boolean).join(' ')

export const chunk = (arr: any[], size: number): any[] => {
  if (!Array.isArray(arr)) return []
  if (!size || size < 1) return arr
  return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], [])
}

export const isEmail = (str: string) =>
	/^\S+@\S+\.\S+$/.test(str || '')

export const composeSlug = (str: string) =>
	(str || '').toLowerCase().replace(/[^\w\s\-/]+/g, '').replace(/[\s\-]+/g, '-')

export const escapeHtml = (str: string) =>
  (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

export const removeHtml = (str: string) =>
  (str || '').replace(/<\/[^>]+>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export const composeExcerpt = (str: string, charLimit: number, appendEllipsis = true) => {
  if (!str) return ''
  if (!charLimit || str.length <= charLimit) return str
  return escapeHtml(str).substring(0, charLimit).split(' ').slice(0, -1).join(' ') + (appendEllipsis ? '...' : '')
}

export const composeFacebookShareLink = (url: string) =>
  'https://www.facebook.com/sharer/sharer.php?u=' + (url || '')

export const composeTwitterShareLink = (url: string) =>
  'https://twitter.com/intent/tweet?text=' + (url || '')
  
export const purifySubmitFields = (submitEvent: any) =>
  [...submitEvent.target?.elements].filter(field => field.name && field.value && !field.name.startsWith('fui-config') 
    && (field.type !== 'radio' || field.checked))
  
export const formToHtml = (heading = 'Form Submission', submitEvent: any) => {
  let html = heading 
    ? `<h3 style='margin: 0 0 12px 0;'>${heading}</h3> <ul style='padding: 0 0 0 24px; margin: 0;'>`
    : ''

  purifySubmitFields(submitEvent).forEach(field => {
    const title = escapeHtml(field.name.replace(/\*/g, ''))
    const value = field.type !== 'checkbox' ? escapeHtml(field.value) : (field.checked ? 'Yes' : 'No')

    html += `<li style='margin: 0 0 12px 0;'><span style='font-weight: bold;'>${title}:</span> <br>${value}</li>`
  })

  return html + '</ul>'
}

export const formDataEntriesToObject = (formDataEntries: Array<[string, any]>): any => {
  const concat = (acc: any, [_key, _value]: any): any => {
    const keys = Array.isArray(_key) ? _key : _key.split('.')
    const [key, ...subKeys] = keys

    const value = keys.length === 1 
      ? _value
      : concat(acc ? acc[key] : null, [subKeys, _value])

    if (+key >= 0) {
      const arr = acc || []
      arr[key] = value
      return arr
    }

    return { ...acc, [key]: value }
  }

  return formDataEntries.reduce(concat, null) ?? {}
}

export const formToObject = (submitEvent: any): any =>
  formDataEntriesToObject(Array.from(new FormData(submitEvent.target)))

interface PingRequestData {
  headers?: object
  abortController?: AbortController
  [x:string]: any
}

type PingResponse = {
  res: Response | null
  data: Object
}

export const ping = async (
  url: string,
  { headers, abortController, ...body }: PingRequestData
): Promise<PingResponse> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      signal: abortController?.signal,
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
    })

    return {
      res,
      data: res.headers.get('content-type')?.includes('application/json') ? await res.json() : {},
    }
  }
  catch (err) {
    console.error('Fetch error: ', err)

    return { res: null, data: {} }
  }
}

/* Begin signals */
export const signalEvent = (selector: any, event: string, detail: Object) => {
  const element = typeof selector === 'string' 
    ? document.querySelector(selector)
    : selector?.current
    || selector?.currentTarget?.closest('.fui-listener')
      
  element?.dispatchEvent(new CustomEvent(event, { detail }))
}

/* Modals */
export const signalModal = (selector: any, detail: Object) =>
  signalEvent(selector, 'FUIModalAction', detail)

export const closeModal = (selector: any, data?: Object) =>
  signalModal(selector, { action: 0, ...(data ?? {}) })

export const openModal = (selector: any, data?: Object) =>
  signalModal(selector, { action: 1, ...(data ?? {}) })

export const toggleModal = (selector: any, data?: Object) =>
  signalModal(selector, { action: 2, ...(data ?? {}) })

/* Expands */
export const signalExpand = (selector: any, detail: Object) =>
  signalEvent(selector, 'FUIExpandAction', detail)

export const closeExpand = (selector: any, data?: Object) =>
  signalExpand(selector, { action: 0, ...(data ?? {}) })

export const openExpand = (selector: any, data?: Object) =>
  signalExpand(selector, { action: 1, ...(data ?? {}) })

export const toggleExpand = (selector: any, data?: Object) =>
  signalExpand(selector, { action: 2, ...(data ?? {}) })

/* Repeaters */
export const signalRepeater = (selector: any, detail: Object) =>
  signalEvent(selector, 'FUIRepeaterAction', detail)

export const insertRepeaterItem = (selector: any, item: any, index?: number) =>
  signalRepeater(selector, { action: 0, index, item })

export const removeRepeaterItem = (selector: any, index?: number) =>
  signalRepeater(selector, { action: 1, index, })

export const updateRepeaterItem = (selector: any, item: any, index: number) =>
  signalRepeater(selector, { action: 2, index, item })

export const setRepeaterItems = (selector: any, items: any[]) =>
  signalRepeater(selector, { action: 3, data: { items } })

export const getRepeaterItems = (selector: any): any[] => {
  let data = { items: [] }
  signalRepeater(selector, { action: 4, selector, data })
  return data.items
}

export const getRepeaterMethods = (selector: any) => ({
  insert: (item: any, index?: number) => insertRepeaterItem(selector, item, index),
  remove: (index?: number) => removeRepeaterItem(selector, index),
  update: (item: any, index: number) => updateRepeaterItem(selector, item, index),
  set: (items: any[]) => setRepeaterItems(selector, items),
  get: () => getRepeaterItems(selector),
})
/* End signals */

export const onIntersect = (selector: string, callback: Function, offset = '0px 0px 0px 0px', once = true) => {
  document.querySelectorAll(selector).forEach(element => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        callback(entry.target)
        if (once) observer.disconnect()
      })
    }, { rootMargin: offset })
    observer.observe(element)
  })
}

export const initLazyLoad = (offset = '750px') => {
  const offsetStr = `${offset} ${offset} ${offset} ${offset}`

  onIntersect('[data-lazy-src]', (element: HTMLImageElement) => {
    element.src = element.dataset.lazySrc ?? ''
  }, offsetStr)

  onIntersect('[data-lazy-srcset]', (element: HTMLImageElement) => {
    element.srcset = element.dataset.lazySrcset ?? ''
  }, offsetStr)
}

export const initScrollView = (offset = '999999px 0px -25% 0px') =>
  onIntersect('.scroll-view', (element: HTMLElement) => element.classList.add('scroll-view-active'), offset)

export const initSplitLetters = (selector: string, delay = 0, step = 25) => {
  document.querySelectorAll(selector).forEach(element => {
    let letterIndex = 0

    element.innerHTML = element.innerHTML.split(' ').map(word => '<span style="display: inline-flex;">' +
      word.split('').map(letter => 
        `<div class="split-letter" style="display: inline-block; animation-delay: ${letterIndex++ * step + delay}ms">${letter}</div>`
      ).join('')
    + '</span>').join(' ')
  })
}