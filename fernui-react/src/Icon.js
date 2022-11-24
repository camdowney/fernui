import React from 'react'

export default function Icon({ i, style, ...props }) {
  return (
    <svg
      style={{ iconStyles, ...style }}
      {...props}
    />
  )
}

const iconStyles = {
  flexShrink: '0',
  fill: 'currentcolor',
}