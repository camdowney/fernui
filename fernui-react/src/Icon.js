import React from 'react'

export default function Icon({ i, ...props }) {
  console.log(i)

  return (
    <svg
      style={{ ...iconStyles }}
    >
      {i.children}
    </svg>
  )
}

const iconStyles = {
  flexShrink: '0',
  fill: 'currentcolor',
}