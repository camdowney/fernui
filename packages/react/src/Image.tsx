import React from 'react'
import { cn } from '@fernui/react-util'
import ImageRaw, { ImageRawProps } from './ImageRaw'

export interface ImageProps extends ImageRawProps {
  className?: string
  style?: Object
  ratioClass?: string
  innerClass?: string
  placeholder?: any
  cover?: boolean
}

export default function Image({
  className,
  style,
  ratioClass,
  innerClass,
  placeholder,
  cover,
  ...props
}: ImageProps) {
  return (
    <div
      className={cn('fui-image', className)}
      style={{ ...style, ...(cover ? _coverStyle : _defaultStyle) } as Object}
    >
      <div className={cn(ratioClass)}>
        {placeholder ?? <div className='fui-placeholder' style={_placeholderStyle as Object} />}
        <ImageRaw
          className={innerClass}
          style={_imageStyle}
          {...props}
        />
      </div>
    </div>
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

const _imageStyle = () => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
})