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

  const getParagraphHTML = (children: string) =>
    `<p style='padding: 12px 0 0 0; margin: 0;'>${children}</p>`

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
    + (options.signature ? getParagraphHTML(options.signature) : '')
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