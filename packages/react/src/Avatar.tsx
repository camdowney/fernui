import React, { useState } from 'react'
import { cn } from '@fernui/react-util'
import { profile } from './icons'
import Image, { ImageProps } from './Image'
import Icon from './Icon'

export type Color = string
export type ColorMap = (letter: string) => Color

const defaultColors: ColorMap = letter => (
  'JWHF'.includes(letter) ? '#bb2e94' :   // red
  'SLEIQM'.includes(letter) ? '#7d2b9c' : // purple
  'DRVYOP'.includes(letter) ? '#2d4baf' : // blue
  'CKZXG'.includes(letter) ? '#1c7963' :  // aqua
  '#469310'                               // green 
)

export interface AvatarProps extends ImageProps {
  title?: any
  src?: any
  colors?: ColorMap
  [props: string]: any
}

export default function Avatar({
  title,
  src,
  colors = defaultColors,
  className,
  ...props
}: AvatarProps) {
  const firstLetter = title ? title.substring(0, 1).toUpperCase() : null
  const [validSrc, setValidSrc] = useState(!!src)
  const { as, innerClass, placeholder, cover, lazy, ...nonImageProps } = props

  return validSrc ? (
    <Image
      src={src}
      alt={title}
      className={cn('fui-avatar', className)}
      onError={() => setValidSrc(false)}
      {...props}
    />
  ) : firstLetter ? (
    <div
      className={cn('fui-avatar', className)}
      style={_letterStyle(firstLetter, colors)}
      {...nonImageProps}
    >
      {firstLetter}
    </div>
  ) : (
    <Icon
      i={profile}
      className={cn('fui-avatar', className)}
      {...nonImageProps}
    />
  )
}

const _letterStyle = (firstLetter: string, colors: ColorMap) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors(firstLetter),
})