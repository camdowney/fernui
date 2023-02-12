import React from 'react'
import { cn } from '@fernui/util'

export interface MediaProps {
  as?: any
  src?: string
  srcSet?: string
  sizes?: string
  alt?: string
  className?: string
  style?: Object
  innerClass?: string
  placeholder?: any
  cover?: boolean
  lazy?: boolean
  defaultSrcSet?: boolean
  [x:string]: any
}

export default function Media({
  as = 'img',
  src,
  srcSet,
  sizes,
  alt,
  className,
  style,
  innerClass,
  placeholder,
  cover,
  lazy,
  defaultSrcSet,
  ...props
}: MediaProps) {
  const Shell = as
  const sources = srcSet ?? defaultSrcSet ? `/sm/${src} 640w, /md/${src} 1024w, /lg/${src}` : null

  return (
    <div
      className={cn('fui-media', className)}
      style={{ ...style, ...(cover ? coverOuterStyle : defaultOuterStyle) } as Object}
    >
      {placeholder ?? <div className='fui-placeholder' style={placeholderStyle as Object} />}
      <Shell
        src={(src && !lazy) ? src : undefined}
        data-lazy-src={(src && lazy) ? src : undefined}
        srcSet={(sources && !lazy) ? sources : undefined}
        data-lazy-srcset={(sources && lazy) ? sources : undefined}
        sizes={sizes ?? defaultSrcSet ? '100vw' : undefined}
        alt={alt ?? cover ? '' : undefined}
        className={innerClass}
        style={typeof as === 'string' ? defaultMediaStyle(as) : undefined}
        {...props}
      />
    </div>
  )
}

const defaultOuterStyle = {
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
}

const coverOuterStyle = {
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

const placeholderStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundImage: 'linear-gradient(to right, #e0e0e0, #c0c0c0)',
}

const defaultMediaStyle = (as: any) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: as !== 'iframe' ? 'cover' : 'initial',
  objectPosition: as !== 'iframe' ? 'center' : 'initial',
})