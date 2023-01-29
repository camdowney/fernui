import React from 'react'
import { Cond } from '..'
import { cn } from '../util'

interface Props {
  as?: string
  src?: string
  className?: string
  style?: object
  innerClass?: string
  alt?: string
  placeholder?: any
  cover?: boolean
  auto?: boolean
  priority?: boolean
  [x:string]: any
}

export default function Media({
  as = 'img',
  src,
  className,
  style,
  innerClass,
  alt = '',
  placeholder,
  cover,
  auto,
  priority,
  ...props
}: Props) {
  const responsive = as === 'img' && src && src.includes('.webp') && !src.startsWith('http')
  const srcset = `/sm/${src} 640w, /md/${src} 1024w, /lg/${src}`
  const autoVideo = as === 'video' && auto

  return (
    <div
      className={cn('fui-media', className)}
      style={{ ...style, ...(cover ? coverOuterStyle : defaultOuterStyle) } as Object}
      {...props}
    >
      {placeholder ?? <div className='fui-placeholder' style={placeholderStyle as Object} />}
      <Cond
        hide={!src}
        as={as}
        src={(!responsive && priority) ? src : undefined}
        data-lazy-src={(!responsive && !priority) ? src : undefined}
        srcSet={(responsive && priority) ? srcset : undefined}
        data-lazy-srcset={(responsive && !priority) ? srcset : undefined}
        sizes={responsive ? '100vw' : undefined}
        className={innerClass}
        allowFullScreen={as === 'iframe'}
        title={as === 'iframe' ? alt : undefined}
        alt={alt}
        style={typeof as === 'string' ? defaultMediaStyle(as) : undefined}
        autoPlay={autoVideo}
        muted={autoVideo}
        loop={autoVideo}
        playsInline={autoVideo}
      />
    </div>
  )
}

const defaultOuterStyle = {
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
  zIndex: '10',
}

const coverOuterStyle = {
  overflow: 'hidden',
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
}

const placeholderStyle = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  backgroundImage: 'linear-gradient(to right, #e0e0e0, #c0c0c0)',
}

const defaultMediaStyle = (as: any) => ({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  objectFit: as !== 'iframe' ? 'cover' : 'initial',
  objectPosition: as !== 'iframe' ? 'center' : 'initial',
})