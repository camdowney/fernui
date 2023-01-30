import React from 'react'
import Media from './Media'
import Icon from './Icon'
import { profile } from '../icons'

interface AvatarProps {
  title?: any
  src?: any
  [x:string]: any
}

export default function Avatar({ title, src, ...props }: AvatarProps) {
  const firstLetter = title?.substring(0, 1).toUpperCase()

  return src ? (
    <Media
      src={src}
      alt={title}
      {...props}
    />
  ) : firstLetter ? (
    <div style={letterStyle(firstLetter)} {...props}>
      {firstLetter}
    </div>
  ) : (
    <Icon
      i={profile}
      style={{ aspectRatio: '1' }}
      {...props}
    />
  )
}

const letterStyle = (firstLetter: string) => ({
  aspectRatio: '1/1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors(firstLetter),
})

const colors = (l: string) => (
  'JWHF'.includes(l) ? 'hsl(34, 82%, 60%)' : // orange
  'SLEIQM'.includes(l) ? 'hsl(133, 56%, 55%)' : // green
  'DRVYOP'.includes(l) ? 'hsl(182, 56%, 54%)' : // aqua
  'CKZXG'.includes(l) ? 'hsl(218, 59%, 56%)' : // blue
  'BATUN'.includes(l) ? 'hsl(325, 58%, 60%)' : '' // violet
)