import React from 'react'

export interface IconProps {
  i: { children: string }
  [x:string]: any
}

export default function Icon({ i, ...props }: IconProps) {
  const { children, ...rest } = i

  return (
    <svg
      style={{ ...iconStyle }}
      dangerouslySetInnerHTML={{ __html: children }}
      {...{ ...rest, ...props}}
    />
  )
}

const iconStyle = {
  flexShrink: 0,
  fill: 'currentcolor',
}