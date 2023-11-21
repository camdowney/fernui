export interface KeyObject { [key: string]: any }

export const cycle = (range: number, currentIndex: number, direction: 1 | -1) =>
  direction === -1
    ? (currentIndex > 0 ? currentIndex - 1 : range - 1)
    : (currentIndex < range - 1 ? currentIndex + 1 : 0)

export const chunk = <T>(arr: T[], chunkSize: number): T[][] => {
  if (!Array.isArray(arr)) return []
  if (!chunkSize || chunkSize < 1) return [arr]

  const chunks: T[][] = []

  for (let i = 0; i < arr.length; i += chunkSize)
    chunks.push(arr.slice(i, i + chunkSize))

  return chunks
}

export const isEmail = (str: string) =>
	/^\S+@\S+\.\S+$/.test(str || '')

// Courtesy of https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
export const slugify = (str: string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')
  
  return str.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
  }

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

export const capitalize = (str: string) =>
  (str && str.length > 0) ? (str[0].toLocaleUpperCase() + str.substring(1)) : ''

export const stringify = (value: any) =>
  value instanceof Map ? JSON.stringify(Array.from(value.entries()))
    : value === Object(value) ? JSON.stringify(value)
    : String(value)

export const escapeHTML = (str: string) =>
  (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;').trim()

export const removeHTML = (str: string) =>
  (str || '').replace(/<\/[^>]+>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export const getExcerpt = (str: string, charLimit: number, appendEllipsis = true) => {
  if (!str) return ''
  if (!charLimit || str.length <= charLimit) return str
  return escapeHTML(str).substring(0, charLimit).split(' ').slice(0, -1).join(' ') + (appendEllipsis ? '...' : '')
}

export const toNumber = (value: any) =>
  Number(isNaN(value) ? String(value).replace(/[^0-9.]/g, '') : value)

export const toArray = (value: any) =>
  Array.isArray(value) ? value : [value]

export const callIfFunction = <T>(value: T, ...params: any[]) =>
  typeof value === 'function' ? value(...params) : value

export const getUniqueFileName = (fileName: string, index = -1) =>
  `${slugify(fileName.split('.').slice(0, -1).join('.'))
  }-${Date.now().toString(36)}${index >= 0 ? `-${index}` : ''}.${fileName.split('.').pop()}`

export const objectHasValue = (obj?: any) =>
  !!obj && typeof obj === 'object' && Object.keys(obj).length > 0

export const hasSimilarValue = (value1: string, value2: string) =>
  (value1 ?? '').toLowerCase().includes((value2 ?? '').toLowerCase())

export const searchByKeys = <T extends KeyObject>(items: T[], keys: string[], value: string) =>
  !keys ? items : items.filter(item => keys.some(key => hasSimilarValue(item[key], value)))

export const sortByKey = <T extends KeyObject>(
  items: T[],
  key: string,
  options?: {
    numeric?: boolean
    order?: 'asc' | 'desc' | '' | false
  }
) => {
  const { numeric, order } = options || { order: 'asc' }

  if (!order) return items

  const orderDesc = order === 'desc'

  const normalizeValue = (value: T) =>
    numeric ? toNumber(value) : value

  return Array.from(items)
    .sort((item1, item2) => 
      normalizeValue(item1[key]) <= normalizeValue(item2[key])
        ? (orderDesc ? 1 : -1)
        : (orderDesc ? -1 : 1)
    )
}

export const filterByKeys = <T extends KeyObject>(items: T[], filters: KeyObject) => {
  if (Object.entries(filters).length < 1) return items

  return items.filter(item =>
    Object.entries(filters).some(([key, value]) =>
      [null, undefined, '@ignore', item[key]].includes(value)
    )
  )
}

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

export const objectToURI = (object: {}) =>
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

export const formEntriesToHTML = (
  formEntries: [any, any][],
  options: {
    heading?: string
    signature?: string | false
    uploadPath?: string,
  } = {}
) => {
  const getHeadingHTML = (children: string) =>
    `<h3 style='margin: 0;'>${children}</h3> `

  const getSignatureHTML = (children: string) =>
    `<p style='font-style: italic; padding: 18px 0 0 0; margin: 0;'>${children}</p>`

  const getBoldHTML = (children: string) =>
    `<span style='font-weight: bold;'>${children}:</span> `

  const getLinkHTML = (children: string) =>
    `<a style='margin: 0;' href='${children}' target='_blank' rel='noopener noreferrer'>${
      (options.uploadPath && children.includes(options.uploadPath))
        ? children.split('/').pop()
        : children
    }</a> `

  const getListHTML = (children: string[], options: { pt?: number } = {}) =>
    `<ul style='padding: ${options.pt ?? 12}px 0 0 24px; margin: 0;'>${
      children.map((child, i) =>
        `<li style='padding: ${i < 1 ? '0' : '12'}px 0 0 0; margin: 0;'>${child}</li> `
      ).join('')
    }</ul> `

  return (options.heading ? getHeadingHTML(options.heading) : '')
    + getListHTML(
        formEntries
          .filter(([name]) => !name.startsWith('__config'))
          .map(([name, value]) =>
            `${
              getBoldHTML(escapeHTML(name.replace(/\*/g, '')))
            }<br>${
              Array.isArray(value) ? getListHTML(
                value.map(v => v.startsWith('http') ? getLinkHTML(v) : v)
              , { pt: 6 })
              : value === true ? 'Yes' 
              : value === false ? 'No'
              : escapeHTML(value)
            }`
          )
      )
    + (options.signature ? getSignatureHTML(options.signature) : '')
}

export const promisify = async (callback: Function) =>
  new Promise((resolve, reject) => {
    callback()
      .then((res: any) => resolve(res.result))
      .catch((err: any) => reject(err.result))
  })

export const handlePingResponse = async (fetchCallback: () => Promise<Response>) => {
  try {
    const res = await fetchCallback()
    const text = await res.text()

    let data = {}

    try {
      data = JSON.parse(text)
    }
    catch (error) {
      data = { text }
    }

    return { res, data }
  }
  catch (error) {
    return {
      res: new Response(null, { status: 400 }),
      data: { error } as Object,
    }
  }
}

export interface PingRequest extends Omit<RequestInit, 'body'>{
  body?: any
}

export const ping = {
  post: async (url: string, request?: PingRequest) => {
    const { body, headers, ...rest } = request ?? {}

    return await handlePingResponse(async () =>
      await fetch(url, {
        method: 'POST',
        body: stringify(body),
        ...rest,
        headers: {
          ...(typeof body === 'object' && { 'Content-Type': 'application/json' }),
          ...headers,
        },
      })
    )
  },
  get: async (url: string, request?: PingRequest) => {
    return await handlePingResponse(async () =>
      await fetch(url, {
        method: 'GET',
        ...request,
      })
    )
  },
}