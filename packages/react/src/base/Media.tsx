import React from 'react'
import { cn } from '@fernui/react-util'

export interface MediaProps {
  as?: any
  src?: string
  srcSet?: string
  sizes?: string
  alt?: string
  className?: string
  style?: Object
  mediaClass?: string
  placeholder?: any
  cover?: boolean
  outer?: boolean
  lazy?: boolean
  [props: string]: any
}

export default function Media({
  as = 'img',
  src,
  srcSet,
  sizes,
  alt,
  className,
  style,
  mediaClass,
  placeholder,
  cover,
  outer = true,
  lazy,
  ...props
}: MediaProps) {
  const Shell = as

  const MediaInner = () => (
    <Shell
      src={(src && !lazy) ? src : undefined}
      data-lazy-src={(src && lazy) ? src : undefined}
      srcSet={(srcSet && !lazy) ? srcSet : undefined}
      data-lazy-srcset={(srcSet && lazy) ? srcSet : undefined}
      sizes={sizes ?? '100vw'}
      alt={alt ?? ''}
      className={outer ? mediaClass : className}
      style={(outer && typeof as === 'string') ? _innerStyle(as) : undefined}
      {...props}
    />
  )

  return outer ? (
    <div
      className={cn('fui-media', className)}
      style={{ ...style, ...(cover ? _coverStyle : _defaultStyle) } as Object}
    >
      {placeholder ?? <div className='fui-placeholder' style={_placeholderStyle as Object} />}
      <MediaInner />
    </div>
  ) : (
    <MediaInner />
  )
}

const _defaultStyle = {
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
}

const _coverStyle = {
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

const _placeholderStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundImage: 'linear-gradient(to right, #e0e0e0, #c0c0c0)',
}

const _innerStyle = (as: any) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: as !== 'iframe' ? 'cover' : 'initial',
  objectPosition: as !== 'iframe' ? 'center' : 'initial',
})