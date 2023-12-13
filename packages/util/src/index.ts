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

export const searchByKeys = <T extends KeyObject>(items: T[], value: string, keys: string[] = []) =>
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
      [null, undefined, item[key]].includes(value)
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

export type HTMailNode = [
  tag: string,
  children?: string | HTMailNode[],
  atts?: {
    pt?: number
    pr?: number
    pb?: number
    pl?: number
    bold?: boolean
    link?: string
  }
]

export const htmail = (nodes: HTMailNode[]) => {
  const nodeToHTML = ([tag, children, atts]: HTMailNode): string => {
    if (children === undefined) return ''
    if (tag === 'br') return '<br>'

    const { pt, pr, pb, pl, bold, link } = { ...{ pt: 0, pr: 0, pb: 0, pl: 0 }, ...atts }

    const e = escapeHTML
    const t = e(tag)
    const c = typeof children === 'string' ? e(children) : children.map(nodeToHTML).join('')

    return `<${t} style='margin:0;padding:0;border:solid transparent;border-width:${pt}px ${pr}px ${pb}px ${pl}px;${bold ? 'font-weight: bold;' : ''}${link ? 'display: inline-block;' : ''}' ${link ? `href='${e(link)}' target='_blank' rel='noopener noreferrer'` : ''}>${c}</${t}> `
  }

  return nodes.map(nodeToHTML).join('')
}

export const formEntriesToHTML = (
  formEntries: [string, string][],
  options?: {
    heading?: string
    signature?: string
    safePaths?: string[]
  }
) => {
  const { heading, signature, safePaths } = { safePaths: [], ...options }

  return htmail([
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
                ? ['a', v.split(safePaths.find(p => v.includes(p))).pop(), { link: v }]
                : ['span', value === 'true' ? 'Yes' : value === 'false' ? 'No' : value]
            ],
            { pt: i > 0 ? 3 : 1, pl: 4 }
          ] satisfies HTMailNode),
        ]
      ] satisfies HTMailNode),
    ['p', signature, { pt: 18 }],
  ])
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

    let data: any = {}

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

    return await handlePingResponse(async () =>
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
    return await handlePingResponse(async () =>
      await fetch(url, {
        method: 'GET',
        ...request,
      })
    )
  },
}