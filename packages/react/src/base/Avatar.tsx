import React from 'react'
import Media from './Media'
import Icon from './Icon'
import { profile } from '../icons'

export type Color = string
export type ColorMap = (letter: string) => Color

const defaultColors: ColorMap = letter => (
  'JWHF'.includes(letter) ? '#eda445' :   // orange
  'SLEIQM'.includes(letter) ? '#4ccd68' : // green
  'DRVYOP'.includes(letter) ? '#48c7cb' : // aqua
  'CKZXG'.includes(letter) ? '#4d7dd1' :  // blue
  '#d45ea3' // 'BATUN'               // violet
)

export interface AvatarProps {
  title?: any
  src?: any
  colors?: ColorMap
  [x:string]: any
}

export default function Avatar({ title, src, colors = defaultColors, ...props }: AvatarProps) {
  const firstLetter = title?.substring(0, 1).toUpperCase()

  return src ? (
    <Media
      src={src}
      alt={title}
      {...props}
    />
  ) : firstLetter ? (
    <div style={letterStyle(firstLetter, colors)} {...props}>
      {firstLetter}
    </div>
  ) : (
    <Icon
      i={profile}
      {...props}
    />
  )
}

const letterStyle = (firstLetter: string, colors: ColorMap) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors(firstLetter),
})