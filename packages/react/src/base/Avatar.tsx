import React, { useState } from 'react'
import Media, { MediaProps } from './Media'
import Icon from './Icon'
import { profile } from '../icons'

export type Color = string
export type ColorMap = (letter: string) => Color

const defaultColors: ColorMap = letter => (
  'JWHF'.includes(letter) ? '#eda445' :   // orange
  'SLEIQM'.includes(letter) ? '#4ccd68' : // green
  'DRVYOP'.includes(letter) ? '#48c7cb' : // aqua
  'CKZXG'.includes(letter) ? '#4d7dd1' :  // blue
  '#d45ea3'                               // violet
)

export interface AvatarProps extends MediaProps {
  title?: any
  src?: any
  colors?: ColorMap
  [x:string]: any
}

export default function Avatar({
  title,
  src,
  colors = defaultColors,
  ...props
}: AvatarProps) {
  const firstLetter = title?.substring(0, 1).toUpperCase()
  const [validSrc, setValidSrc] = useState(!!src)
  const { as, innerClass, placeholder, cover, lazy, defaultSrcSet, ...nonMediaProps } = props

  return validSrc ? (
    <Media
      src={src}
      alt={title}
      onError={() => setValidSrc(false)}
      {...props}
    />
  ) : firstLetter ? (
    <div style={letterStyle(firstLetter, colors)} {...nonMediaProps}>
      {firstLetter}
    </div>
  ) : (
    <Icon
      i={profile}
      {...nonMediaProps}
    />
  )
}

const letterStyle = (firstLetter: string, colors: ColorMap) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors(firstLetter),
})