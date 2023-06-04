export const chunk = (arr: any[], size: number): any[] => {
  if (!Array.isArray(arr)) return []
  if (!size || size < 1) return arr
  return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], [])
}

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

export const getFacebookShareLink = (url: string) =>
  'https://www.facebook.com/sharer/sharer.php?u=' + (url || '')

export const getTwitterShareLink = (url: string) =>
  'https://twitter.com/intent/tweet?text=' + (url || '')

export const objectToURI = (object: {}) =>
  Object.entries(object)
    .map(([key, value]: any) => `${encodeURIComponent(key)}=${
      encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value)
    }`)
    .sort()
    .join('&')

export const promisify = async (callback: Function) => {
  return new Promise((resolve, reject) => {
    callback()
      .then((res: any) => resolve(res.result))
      .catch((err: any) => reject(err.result))
  })
}
  
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