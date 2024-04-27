import React from 'react'
import { cn, oc } from '@fernui/util'
import { coverStyle } from './_styles'

export type Color = string
export type ColorMap = (letter: string) => Color

export interface AvatarProps {
  domRef?: any
  src?: string
  title?: string | null | false
  colors?: ColorMap
  className?: string
  style?: Object
  letterProps?: Object
  imageProps?: Object
  placeholderClass?: string
  placeholderStyle?: Object
  [props: string]: any
}

export default function Avatar({
  domRef,
  src,
  title,
  colors = defaultColors,
  className,
  style,
  letterProps,
  imageProps,
  placeholderClass,
  placeholderStyle,
  ...props
}: AvatarProps) {
  const letter = title ? title.substring(0, 1).toUpperCase() : '?'

  return (
    <div
      ref={domRef}
      className={cn('fui-avatar', className)}
      style={oc(styles.outer, style)}
      {...props}
    >
      {/* Placeholder */}
      <div
        className={cn('fui-avatar-placeholder', placeholderClass)}
        style={oc(coverStyle, placeholderStyle)}
      />

      {/* Image / letter */}
      {src ? (
        <div
          aria-label={title || letter}
          {...imageProps}
          style={oc(
            coverStyle,
            styles.image,
            { backgroundImage: `url(${src})` },
            (imageProps ?? {} as any).style
          )}
        />
      ) : (
        <div
          {...letterProps}
          style={oc(
            coverStyle,
            styles.letter(letter, colors),
            (letterProps ?? {} as any).style)
          }
        >
          {letter}
        </div>
      )}
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