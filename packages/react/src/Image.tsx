import React from 'react'
import { cn, oc } from '@fernui/util'
import { coverStyle } from './_styles'

export interface ImageProps {
  domRef?: any
  src?: string
  alt?: string
  cover?: boolean
  placeholder?: any
  className?: string
  style?: Object
  ratioClass?: string
  innerClass?: string
  innerProps?: Object
  [props: string]: any
}

export default function Image({
  domRef,
  src,
  alt,
  cover,
  placeholder,
  className,
  style,
  ratioClass,
  innerClass,
  innerProps,
  ...props
}: ImageProps) {
  return (
    <div
      ref={domRef}
      className={cn('fui-image', className)}
      style={oc(cover ? coverStyle : styles.outer, style)}
      {...props}
    >
      <div className={cn(ratioClass)}>
        {placeholder ?? <div className='fui-placeholder' style={oc(styles.placeholder)} />}

        <div
          style={oc(styles.image, src && { backgroundImage: `url(${src})` })}
          className={cn(innerClass)}
          {...innerProps}
        />
      </div>
    </div>
  )
}

const styles = {
  outer: {
    position: 'relative',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundImage: 'linear-gradient(to bottom right, #e0e0e0, #c0c0c0)',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  },
}