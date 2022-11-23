import React from 'react'
import Media from './Media'
import Icon from './Icon'

export default function Avatar({ title, src, className }) {
  const firstLetter = title?.substring(0, 1).toUpperCase()

  return src ? (
    <Media
      src={src}
      alt={title}
      className={className}
    />
  ) : firstLetter ? (
    <div className={className} style={letterStyles(firstLetter)}>
      {firstLetter}
    </div>
  ) : (
    <Icon
      i='profile'
      className={className}
      style={{ aspectRatio: '1' }}
    />
  )
}

const letterStyles = firstLetter => ({
  aspectRatio: '1/1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors(firstLetter),
})

const colors = l => (
  'JWHF'.includes(l) ? 'hsl(34, 82%, 60%)' : // orange
  'SLEIQM'.includes(l) ? 'hsl(133, 56%, 55%)' : // green
  'DRVYOP'.includes(l) ? 'hsl(182, 56%, 54%)' : // aqua
  'CKZXG'.includes(l) ? 'hsl(218, 59%, 56%)' : // blue
  'BATUN'.includes(l) ? 'hsl(325, 58%, 60%)' : '' // violet
)