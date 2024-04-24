import React, { useState } from 'react'
import { cn } from '@fernui/util'
import { profile } from './_icons'
import Image, { ImageProps } from './Image'
import Icon from './Icon'

export type Color = string
export type ColorMap = (letter: string) => Color

export interface AvatarProps {
  src?: string | null | false
  title?: string | null | false
  colors?: ColorMap
  imageOnlyProps: ImageProps
  initialOnlyProps: Object
  iconOnlyProps: Object
  [props: string]: any
}

export default function Avatar({
  src,
  title,
  colors = defaultColors,
  className,
  imageOnlyProps,
  initialOnlyProps,
  iconOnlyProps,
  ...props
}: AvatarProps) {
  const firstLetter = title ? title.substring(0, 1).toUpperCase() : null
  const [validSrc, setValidSrc] = useState(!!src)

  return (src && validSrc) ? (
    <Image
      src={src || ''}
      alt={title || ''}
      className={cn('fui-avatar', className)}
      onError={() => setValidSrc(false)}
      {...props}
      {...imageOnlyProps}
    />
  ) : firstLetter ? (
    <div
      className={cn('fui-avatar', className)}
      style={styles.letter(firstLetter, colors)}
      {...props}
      {...initialOnlyProps}
    >
      {firstLetter}
    </div>
  ) : (
    <Icon
      i={profile}
      className={cn('fui-avatar', className)}
      {...props}
      {...iconOnlyProps}
    />
  )
}

const styles = {
  letter: (firstLetter: string, colors: ColorMap) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors(firstLetter),
  }),
}

const defaultColors: ColorMap = letter => (
  'JWHF'.includes(letter) ? '#bb2e94' :   // red
  'SLEIQM'.includes(letter) ? '#7d2b9c' : // purple
  'DRVYOP'.includes(letter) ? '#2d4baf' : // blue
  'CKZXG'.includes(letter) ? '#1c7963' :  // aqua
  '#469310'                               // green 
)