import { useRouter } from 'next/router'

export function getPath(includeParams) {
  const url = useRouter().asPath
  if (includeParams) return url
  return url.split('?')[0]
}