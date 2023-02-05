import React from 'react'
import { cn } from '@fernui/util'

interface MediaProps {
  as?: any
  src: string
  alt?: string
  loading?: string
  className?: string
  style?: Object
  innerClass?: string
  placeholder?: any
  cover?: boolean
  responsive?: boolean
  priority?: boolean
  [x:string]: any
}

export default function Media({
  as = 'img',
  src,
  alt,
  loading,
  className,
  style,
  innerClass,
  placeholder,
  cover,
  responsive = true,
  priority,
  ...props
}: MediaProps) {
  const resp = responsive && as === 'img' && !src.startsWith('http')
  const srcset = `/sm/${src} 640w, /md/${src} 1024w, /lg/${src}`
  const Shell = as

  return (
    <div
      className={cn('fui-media', className)}
      style={{ ...style, ...(cover ? coverOuterStyle : defaultOuterStyle) } as Object}
      {...props}
    >
      {placeholder ?? <div className='fui-placeholder' style={placeholderStyle as Object} />}
      {src &&
        <Shell
          src={(!resp && priority) ? src : undefined}
          data-lazy-src={(!resp && !priority) ? src : undefined}
          srcSet={(resp && priority) ? srcset : undefined}
          data-lazy-srcset={(resp && !priority) ? srcset : undefined}
          sizes={resp ? '100vw' : undefined}
          alt={alt}
          loading={loading}
          className={innerClass}
          style={typeof as === 'string' ? defaultMediaStyle(as) : undefined}
        />
      }
    </div>
  )
}

const defaultOuterStyle = {
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
  zIndex: 10,
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