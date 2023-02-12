import React from 'react'
import { cn } from '@fernui/util'

export interface MediaProps {
  as?: any
  src: string
  srcSet?: string[] | string
  sizes?: string
  alt?: string
  loading?: string
  className?: string
  style?: Object
  innerClass?: string
  placeholder?: any
  cover?: boolean
  lazy?: boolean
  [x:string]: any
}

export default function Media({
  as = 'img',
  src,
  srcSet = ['sm', '640w', 'md', '1024w', 'lg'],
  sizes = '100vw',
  alt,
  loading,
  className,
  style,
  innerClass,
  placeholder,
  cover,
  lazy = true,
  ...props
}: MediaProps) {
  const Shell = as
  const sources = typeof srcSet === 'string'
    ? srcSet
    : srcSet.map((s, i) => i % 2 === 0 ? `/${s}/${src}` : `${s},`).join(' ')

  return (
    <div
      className={cn('fui-media', className)}
      style={{ ...style, ...(cover ? coverOuterStyle : defaultOuterStyle) } as Object}
      {...props}
    >
      {placeholder ?? <div className='fui-placeholder' style={placeholderStyle as Object} />}
      <Shell
        src={(!sources && !lazy) ? src : undefined}
        data-lazy-src={(!sources && lazy) ? src : undefined}
        srcSet={(sources && !lazy) ? sources : undefined}
        data-lazy-srcset={(sources && lazy) ? sources : undefined}
        sizes={sizes}
        alt={alt ?? cover ? '' : undefined}
        loading={loading}
        className={innerClass}
        style={typeof as === 'string' ? defaultMediaStyle(as) : undefined}
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