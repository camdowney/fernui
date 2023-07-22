import React from 'react'

export interface MediaRawProps {
  as?: any
  src?: string
  srcSet?: string
  sizes?: string
  alt?: string
  lazy?: boolean
  [props: string]: any
}

export default function MediaRaw({
  as = 'img',
  src,
  srcSet,
  sizes,
  alt,
  lazy,
  ...props
}: MediaRawProps) {
  const Shell = as

  return (
    <Shell
      src={(src && !lazy) ? src : undefined}
      data-lazy-src={(src && lazy) ? src : undefined}
      srcSet={(srcSet && !lazy) ? srcSet : undefined}
      data-lazy-srcset={(srcSet && lazy) ? srcSet : undefined}
      sizes={sizes ?? '100vw'}
      alt={alt ?? ''}
      {...props}
    />
  )
}