import React, { useState } from 'react'
import { cn } from '@fernui/react-util'
import { profile } from './icons'
import Media, { MediaProps } from './Media'
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

export interface AvatarProps extends MediaProps {
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
  const { as, mediaClass, placeholder, cover, lazy, ...nonMediaProps } = props

  return validSrc ? (
    <Media
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
      {...nonMediaProps}
    >
      {firstLetter}
    </div>
  ) : (
    <Icon
      i={profile}
      className={cn('fui-avatar', className)}
      {...nonMediaProps}
    />
  )
}

const _letterStyle = (firstLetter: string, colors: ColorMap) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors(firstLetter),
})