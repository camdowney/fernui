export interface KeyObject { [key: string]: any }

export const cycle = (range: number, currentIndex: number, direction: 1 | -1) =>
  direction === -1
    ? (currentIndex > 0 ? currentIndex - 1 : range - 1)
    : (currentIndex < range - 1 ? currentIndex + 1 : 0)

export const chunk = (arr: any[], size: number): any[] => {
  if (!Array.isArray(arr)) return []
  if (!size || size < 1) return arr
  return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], [])
}

export const isObject = (x: any) => 
  typeof x === 'object' && !Array.isArray(x)

export const isEmail = (str: string) =>
	/^\S+@\S+\.\S+$/.test(str || '')

export const slugify = (str: string) =>
  (str || '').toLowerCase().replace(/[^\w\s]+/g, '').trim().replace(/[\s\-]+/g, '-')

export const escapeHtml = (str: string) =>
  (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;').trim()

export const removeHtml = (str: string) =>
  (str || '').replace(/<\/[^>]+>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export const getExcerpt = (str: string, charLimit: number, appendEllipsis = true) => {
  if (!str) return ''
  if (!charLimit || str.length <= charLimit) return str
  return escapeHtml(str).substring(0, charLimit).split(' ').slice(0, -1).join(' ') + (appendEllipsis ? '...' : '')
}

export const hasSimilarValue = (value1: string, value2: string) =>
  value1.toLowerCase().includes(value2.toLowerCase())

export const searchByKeys = (items: any[], keys: string[], value: string) =>
  !keys ? items : items.filter(item => keys.some(key => hasSimilarValue(item[key], value)))

export const sortByKey = (items: any[], key?: string) =>
  !key ? items : items.sort((item1, item2) => item1[key] < item2[key] ? -1 : 1)

export const filterByKeys = (items: KeyObject[], filters: KeyObject) => {
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

export const stringifyMap = (map: Map<any, any>) =>
  JSON.stringify(Array.from(map.entries()))

export const objectToURI = (object: {}) =>
  Object.entries(object)
    .map(([key, value]: any) => 
      `${encodeURIComponent(key)}=${
        encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value)
      }`
    )
    .sort()
    .join('&')

export const collapseKeyValues = (values: [any, any][]): any => {
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

  return values.reduce(concat, null) ?? {}
}

export const promisify = async (callback: Function) =>
  new Promise((resolve, reject) => {
    callback()
      .then((res: any) => resolve(res.result))
      .catch((err: any) => reject(err.result))
  })
  
interface PingOptions {
  method?: string
  headers?: {}
  [options:string]: any
}

interface PingResponse {
  res: Response | null
  data: Object
}

export const ping = async (
  url: string,  
  body: any,
  options?: PingOptions
): Promise<PingResponse> => {
  const { method, headers, ...rest } = options ?? {}

  try {
    const res = await fetch(url, {
      method: method || 'POST',
      body: typeof body === 'object' ? JSON.stringify(body) : body,
      ...rest,
      headers: {
        ...(typeof body === 'object' && { 'Content-Type': 'application/json' }),
        ...headers,
      },
    })

    return {
      res,
      data: res.headers.get('content-type')?.includes('application/json') ? await res.json() : {},
    }
  }
  catch (err) {
    console.error('Ping error:', err)

    return { res: null, data: {} }
  }
}