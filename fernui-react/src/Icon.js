import React from 'react'
import { defaultIcons } from './_icons'

export default function Icon({ i, ...props }) {
  const icon = typeof i !== 'string' ? i : (defaultIcons[i] || defaultIcons['angle'])

  return (
    <svg
      viewBox={icon.viewBox}
      preserveAspectRatio={icon?.preserveAspectRatio}
      style={iconStyles}
      {...props}
    >
      {icon.path}
    </svg>
  )
}

const iconStyles = {
  flexShrink: '0',
  fill: 'currentcolor',
}