import React from 'react'
import { userIcon } from '@fernui/icons'
import { KeyObject, cn, oc } from '@fernui/util'
import Svg from './Svg'
import { coverStyle } from './_styles'

export type Color = string
export type ColorMap = (letter: string) => Color

export interface AvatarProps {
  domRef?: any
  src?: string | null | false
  title?: string | null | false
  colors?: ColorMap
  className?: string
  style?: KeyObject
  imageClass?: string
  imageProps?: KeyObject
  letterClass?: string
  letterProps?: KeyObject
  iconClass?: string
  iconProps?: KeyObject
  placeholderClass?: string
  placeholderStyle?: KeyObject
  [props: string]: any
}

export default function Avatar({
  domRef,
  src,
  title,
  colors = defaultColors,
  className,
  style,
  imageClass,
  imageProps = {},
  letterClass,
  letterProps = {},
  iconClass,
  iconProps = {},
  placeholderClass,
  placeholderStyle,
  ...props
}: AvatarProps) {
  const letter = title ? title.substring(0, 1).toUpperCase() : undefined

  return (
    <div
      ref={domRef}
      className={cn('fui-avatar', className)}
      style={oc(styles.outer, style)}
      {...props}
    >
      {src ? <>
        <div
          className={cn('fui-avatar-placeholder', placeholderClass)}
          style={oc(coverStyle, placeholderStyle)}
        />
        <div
          aria-label={title || letter}
          {...imageProps}
          className={cn(imageProps.className, imageClass)}
          style={oc(
            coverStyle,
            styles.image,
            { backgroundImage: `url(${src})` },
            imageProps.style,
          )}
        />
      </> : letter ? <>
        <div
          {...letterProps}
          className={cn(letterProps.className, letterClass)}
          style={oc(
            coverStyle,
            styles.letter(letter, colors),
            letterProps.style,
          )}
        >
          {letter}
        </div>
      </> : <>
        <Svg
          src={userIcon}
          {...iconProps}
          className={cn(iconProps.className, iconClass)}
          style={oc(coverStyle, letterProps.style)}
        />
      </>}
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
  image: {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  },
}

const defaultColors: ColorMap = letter => (
  'JWHF'.includes(letter) ? '#bb2e94' :   // red
  'SLEIQM'.includes(letter) ? '#7d2b9c' : // purple
  'DRVYOP'.includes(letter) ? '#2d4baf' : // blue
  'CKZXG'.includes(letter) ? '#1c7963' :  // aqua
  '#469310'                               // green 
)