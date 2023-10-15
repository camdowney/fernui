import React from 'react'
import { cn } from '@fernui/util'

export interface ImageRawProps {
  src?: string
  srcSet?: string
  sizes?: string
  className?: string
  alt?: string
  lazy?: boolean
  [props: string]: any
}

export default function ImageRaw({
  src,
  srcSet,
  sizes,
  className,
  alt,
  lazy,
  ...props
}: ImageRawProps) {
  return (
    <img
      src={(src && !lazy) ? src : undefined}
      data-lazy-src={(src && lazy) ? src : undefined}
      srcSet={(srcSet && !lazy) ? srcSet : undefined}
      data-lazy-srcset={(srcSet && lazy) ? srcSet : undefined}
      sizes={sizes ?? '100vw'}
      className={cn('fui-image-raw', className)}
      alt={alt ?? ''}
      {...props}
    />
  )
}