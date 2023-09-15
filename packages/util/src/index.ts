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
  isNaN(value) ? Number(String(value).replace(/[^0-9.]/g, '')) : value

export const hasSimilarValue = (value1: string, value2: string) =>
  value1.toLowerCase().includes(value2.toLowerCase())

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

export const expandEntries = (values: [any, any][]): any => {
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

export const formEntriesToHTML = (formEntries: [any, any][], heading = 'Form Submission') => {
  let html = heading ? `<h3 style='margin: 0 0 12px 0;'>${heading}</h3> ` : ''

  html += `<ul style='padding: 0 0 0 24px; margin: 0;'>`

  formEntries
    .filter(([_name]) => !_name.startsWith('__config'))
    .forEach(([_name, _value]) => {
      const name = escapeHTML(_name.replace(/\*/g, ''))
      const value = _value === true ? 'Yes' : _value === false ? 'No' : escapeHTML(_value)

      html += `<li style='margin: 0 0 12px 0;'><span style='font-weight: bold;'>${name}:</span> <br>${value}</li> `
    })

  return html + '</ul>'
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
    const { body, headers, ...rest } = request || {}

    return await handlePingResponse(async () =>
      await fetch(url, {
        method: 'POST',
        body: typeof body === 'object' ? JSON.stringify(body) : body,
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