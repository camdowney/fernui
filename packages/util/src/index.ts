export interface KeyObject <T = any>{ [key: string]: T }

export const cycle = (range: number, currentIndex: number, direction: 1 | -1) =>
  direction === -1
    ? (currentIndex > 0 ? currentIndex - 1 : range - 1)
    : (currentIndex < range - 1 ? currentIndex + 1 : 0)

export const chunk = <T>(arrayValue: T[], chunkSize: number): T[][] => {
  if (!Array.isArray(arrayValue)) return []
  if (!chunkSize || chunkSize < 1) return [arrayValue]

  const chunks: T[][] = []

  for (let i = 0; i < arrayValue.length; i += chunkSize)
    chunks.push(arrayValue.slice(i, i + chunkSize))

  return chunks
}

export const isEmail = (stringValue: string) =>
	/^\S+@\S+\.\S+$/.test(stringValue || '')

// Courtesy of https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
export const slugify = (stringValue: string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')
  
  return stringValue.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
  }

export const cn = (...classes: (string | { [key: string]: string } | false | null | undefined)[]) => {
  let classesStr = ''

  classes.filter(Boolean).forEach(_class => {
    if (typeof _class === 'string')
      return classesStr += _class + ' '

    Object.entries(_class as any)
      .filter(([key, value]) => Boolean(value) && !classesStr.includes(key))
      .forEach(([_, value]) => classesStr += value + ' ')
  })

  return classesStr.trim()
}

export const oc = (...objects: (Object | false | null | undefined)[]) =>
  objects.filter(Boolean).reduce((acc, object) => ({ ...acc as any, ...object }), {}) as Object

export const capitalize = (stringValue: string) =>
  (stringValue && stringValue.length > 0) ? (stringValue[0].toLocaleUpperCase() + stringValue.substring(1)) : ''

export const stringify = (value: any) =>
  value instanceof Map ? JSON.stringify(Array.from(value.entries()))
    : value === Object(value) ? JSON.stringify(value)
    : String(value)

export const escapeHtml = (stringValue: string) =>
  (stringValue || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;').trim()

export const removeHtml = (stringValue: string) =>
  (stringValue || '').replace(/<\/[^>]+>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export const getExcerpt = (
  stringValue: string,
  charLimit: number,
  {
    ellipsis,
    breakWords = true,
  }: {
    ellipsis?: boolean
    breakWords?: boolean
  } = {}
) => {
  if (!stringValue) return ''
  if (!charLimit || stringValue.length <= charLimit) return stringValue

  let newValue = escapeHtml(stringValue).substring(0, charLimit).trim()
  
  if (!breakWords && newValue.length > charLimit)
    newValue = newValue.split(' ').slice(0, -1).join(' ')

  if (ellipsis)
    newValue += '...'

  return newValue
}

export const toNumber = (value: any) =>
  Number(isNaN(value) ? String(value).replace(/[^0-9.]/g, '') : value)

export const toArray = <T>(value: T | T[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

export const callIfFunction = <T>(value: T, ...params: any[]) =>
  typeof value === 'function' ? value(...params) : value

export const getUniqueFileName = (fileName: string, index = -1) =>
  `${slugify(fileName.split('.').slice(0, -1).join('.'))
  }-${Date.now()}${index >= 0 ? `-${index}` : ''}.${fileName.split('.').pop()}`

export const objectIsNotEmpty = (objectValue?: object) =>
  !!objectValue && typeof objectValue === 'object' && Object.keys(objectValue).length > 0

export const withoutFirst = <T extends unknown>(arrayValue: T[], valueToExclude: T) => {
  const index = arrayValue.indexOf(valueToExclude)
  return index === -1 ? arrayValue : arrayValue.filter((_, i) => i !== index)
}

export const containsIgnoreCase = (baseString: string, searchString: string) =>
  (baseString ?? '').toLowerCase().includes((searchString ?? '').toLowerCase())

// export const searchByKeys = <T extends KeyObject>(objects: T[], value: string, keys: string[] = []) =>
//   !keys ? objects : objects.filter(object => keys.some(key => stringIncludesIgnoreCase(object[key], value)))

// export const sortByKey = <T extends KeyObject>(
//   objects: T[],
//   key: string,
//   options?: {
//     numeric?: boolean
//     order?: 'asc' | 'desc' | '' | false
//   }
// ) => {
//   const { numeric, order } = options || { order: 'asc' }

//   if (!order) return objects

//   const orderDesc = order === 'desc'

//   const normalizeValue = (value: T) =>
//     numeric ? toNumber(value) : value

//   return Array.from(objects)
//     .sort((object1, object2) => 
//       normalizeValue(object1[key]) <= normalizeValue(object2[key])
//         ? (orderDesc ? 1 : -1)
//         : (orderDesc ? -1 : 1)
//     )
// }

// export const filterByKeys = <T extends KeyObject>(objects: T[], filters: KeyObject) => {
//   if (Object.entries(filters).length < 1) return objects

//   return objects.filter(object =>
//     Object.entries(filters).some(([key, value]) =>
//       [null, undefined, object[key]].includes(value)
//     )
//   )
// }

export const getFacebookShareLink = (url: string) =>
  'https://www.facebook.com/sharer/sharer.php?u=' + (url || '')

export const getTwitterShareLink = (url: string) =>
  'https://twitter.com/intent/tweet?text=' + (url || '')

export const uriToObject = (uri: string) =>
  Object.fromEntries(
    new URLSearchParams(
      !uri.includes('=') ? ''
        : uri.includes('?') ? uri.substring(uri.indexOf('?'))
        : uri
    )
  )

export const objectToUri = (object: {}) =>
  Object.entries(object)
    .map(([key, value]: any) => `${encodeURIComponent(key)}=${encodeURIComponent(stringify(value))}`)
    .sort()
    .join('&')

export const toDeepObject = (obj: any): KeyObject => {
  const concat = (acc: KeyObject, [keyInit, valueInit]: any): any => {
    const keys = Array.isArray(keyInit) ? keyInit : keyInit.split('.')
    const [rootKey, ...subKeys] = keys

    const value = keys.length === 1 
      ? valueInit
      : concat(acc ? acc[rootKey] : null, [subKeys, valueInit])

    if (+rootKey >= 0) {
      const arr = acc || []
      arr[rootKey] = value
      return arr
    }

    return { ...acc, [rootKey]: value }
  }

  const objectClean: KeyObject =
    obj instanceof Map ? Object.fromEntries(obj)
    : Array.isArray(obj) ? { array: obj }
    : typeof obj === 'object' ? obj
    : { primitive: obj }

  return Object.entries(objectClean).reduce(concat, {}) ?? {}
}

export type SimpleHtmlNode = [
  tag: string,
  children?: string | SimpleHtmlNode[],
  atts?: {
    pt?: number
    pr?: number
    pb?: number
    pl?: number
    bold?: boolean
    link?: string
  }
]

export const generateSimpleHtml = (nodes: SimpleHtmlNode[]) => {
  const nodeToHTML = ([tag, children, atts]: SimpleHtmlNode): string => {
    if (children === undefined) return ''
    if (tag === 'br') return '<br>'

    const { pt, pr, pb, pl, bold, link } = { ...{ pt: 0, pr: 0, pb: 0, pl: 0 }, ...atts }

    const e = escapeHtml
    const t = e(tag)
    const c = typeof children === 'string' ? e(children) : children.map(nodeToHTML).join('')

    return `<${t} style='margin:0;padding:0;border:solid transparent;border-width:${pt}px ${pr}px ${pb}px ${pl}px;${bold ? 'font-weight: bold;' : ''}${link ? 'display: inline-block;' : ''}' ${link ? `href='${e(link)}' target='_blank' rel='noopener noreferrer'` : ''}>${c}</${t}> `
  }

  return nodes.map(nodeToHTML).join('')
}

export const formEntriesToHtml = (
  formEntries: [string, string][],
  {
    heading,
    signature,
    safePaths = [],
  }: {
    heading?: string
    signature?: string
    safePaths?: string[]
  } = {}
) => {
  return generateSimpleHtml([
    ['h3', heading],
    ...formEntries
      .filter(([name]) => !name.startsWith('__config'))
      .map(([name, value]) => [
        'span',
        [
          ['p', name.replace(/\*/g, '').trim() + ':', { pt: 12, bold: true }],
          ...toArray(value).map((v, i) => [
            'p',
            [
              ['span', '• ', { pr: 2 }],
              safePaths.some(path => v.includes(path))
                ? ['a', v.split(safePaths.find(p => v.includes(p)) ?? '').pop(), { link: v }]
                : ['span', value === 'true' ? 'Yes' : value === 'false' ? 'No' : value]
            ],
            { pt: i > 0 ? 3 : 1, pl: 4 }
          ] satisfies SimpleHtmlNode),
        ]
      ] satisfies SimpleHtmlNode),
    ['p', signature, { pt: 18 }],
  ])
}

export const promisify = async (callback: Function) =>
  new Promise((resolve, reject) => {
    callback()
      .then((res: any) => resolve(res.result))
      .catch((err: any) => reject(err.result))
  })

export const createStopwatch = () => {
  let isActive = false
  let startTime = 0
  let storedTime = 0

  const start = () => {
    isActive = true
    startTime += Date.now() - storedTime
  }

  const reset = () => {
    isActive = false
    startTime = 0
    storedTime = 0
  }

  const pause = () => {
    isActive = false
    storedTime = Date.now()
  }

  const time = () =>
    (isActive ? Date.now() : storedTime) - startTime

  return { start, reset, pause, time, isActive }
}


export const throttle = (callback: () => any, delay = 0, runLast = true) => {
  let last = 0
  let timeoutId: any

  const runCallback = () => {
    last = new Date().getTime()
    callback()
  }

  return () => {
    const elapsed = new Date().getTime() - last

    clearTimeout(timeoutId)

    if (elapsed >= delay)
      runCallback()
    else if (runLast)
      timeoutId = setTimeout(runCallback, delay - elapsed)
  }
}

export const res = (
  status: number,
  {
    body,
    headers,
    ...init
  }: {
    body?: KeyObject | null
    headers?: KeyObject
    [init: string]: any
  } = {}
) =>
  new Response(
    body ? JSON.stringify(body) : null,
    { status, headers, ...init }
  )

export const handlePingRequest = async (fetchCallback: () => Promise<Response>) => {
  try {
    const response = await fetchCallback()
    const text = await response.text()

    let data: any = {}

    try {
      data = JSON.parse(text)
    }
    catch (error) {
      data = text ? { text } : null
    }

    return { response, data }
  }
  catch (error) {
    return {
      response: new Response(null, { status: 400 }),
      data: { error },
    }
  }
}

export interface PingRequest extends Omit<RequestInit, 'body'>{
  body?: any
}

export const ping = {
  post: async (url: string, request?: PingRequest) => {
    const { body, headers, ...rest } = request ?? {}

    return await handlePingRequest(async () =>
      await fetch(url, {
        method: 'POST',
        body: stringify(body),
        ...rest,
        headers: {
          ...typeof body === 'object' && { 'Content-Type': 'application/json' },
          ...headers,
        },
      })
    )
  },
  get: async (url: string, request?: PingRequest) => {
    return await handlePingRequest(async () =>
      await fetch(url, {
        method: 'GET',
        ...request,
      })
    )
  },
}