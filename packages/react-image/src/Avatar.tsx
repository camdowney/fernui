import React from 'react'
import { profileIcon } from '@fernui/icons'
import { cn, oc } from '@fernui/util'
import { coverStyle } from './_styles'
import Image, { ImageProps } from './Image'
import Icon from './Icon'

export type Color = string
export type ColorMap = (letter: string) => Color

export interface AvatarProps {
  domRef?: any
  title?: string | null | false
  colors?: ColorMap
  hasImage?: boolean
  className?: string
  style?: Object
  iconProps?: Object
  letterProps?: Object
  imageProps?: ImageProps
  [props: string]: any
}

export default function Avatar({
  domRef,
  title,
  colors = defaultColors,
  hasImage,
  className,
  style,
  iconProps,
  letterProps,
  imageProps,
  ...props
}: AvatarProps) {
  const letter = title ? title.substring(0, 1).toUpperCase() : null

  return (
    <div
      ref={domRef}
      className={cn('fui-avatar', className)}
      style={oc(styles.outer, style)}
      {...props}
    >
      {!letter ? (
        <Icon
          data={profileIcon}
          {...iconProps}
          style={oc(coverStyle, (iconProps ?? {} as any).style)}
        />
      ) : (
        <div
          {...letterProps}
          style={oc(coverStyle, styles.letter(letter, colors), (letterProps ?? {} as any).style)}
        >
          {letter}
        </div>
      )}
      <Image
        {...imageProps}
        alt={title || undefined}
        style={oc(!hasImage && { display: 'none' }, (imageProps ?? {}).style)}
        cover
      />
    </div>
  )
}

const styles = {
  outer: {
    position: 'relative',
  },
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