import React from 'react'

export default function Icon({ i, ...props }) {
  const { children, ...rest } = i

  return (
    <svg
      style={{ ...iconStyles }}
      dangerouslySetInnerHTML={{ __html: children }}
      {...rest}
      {...props}
    />
  )
}

const iconStyles = {
  flexShrink: '0',
  fill: 'currentcolor',
}