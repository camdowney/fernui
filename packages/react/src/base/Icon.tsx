import React from 'react'

interface Props {
  i: { children: string }
  [x:string]: any
}

export default function Icon({ i, ...props }: Props) {
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