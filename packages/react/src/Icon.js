import React from 'react'

export default function Icon({ i, ...props }) {
  const { children, ...rest } = i

  return (
    <svg
      style={{ ...iconStyle }}
      dangerouslySetInnerHTML={{ __html: children }}
      {...rest}
      {...props}
    />
  )
}

const iconStyle = {
  flexShrink: '0',
  fill: 'currentcolor',
}