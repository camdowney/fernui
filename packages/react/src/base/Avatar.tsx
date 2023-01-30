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
  'JWHF'.includes(l) ? '#eda445' : // orange
  'SLEIQM'.includes(l) ? '#4ccd68' : // green
  'DRVYOP'.includes(l) ? '#48c7cb' : // aqua
  'CKZXG'.includes(l) ? '#4d7dd1' : // blue
  'BATUN'.includes(l) ? '	#d45ea3' : '' // violet
)