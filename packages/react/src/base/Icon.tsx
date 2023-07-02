import React from 'react'

export interface IconProps {
  i: { children: string }
  style?: Object
  [props: string]: any
}

export default function Icon({ i, style, ...props }: IconProps) {
  const { children, ...rest } = i

  return (
    <svg
      style={{ ..._style, ...style }}
      dangerouslySetInnerHTML={{ __html: children }}
      {...{ ...rest, ...props}}
    />
  )
}

const _style = {
  flexShrink: 0,
  fill: 'currentcolor',
}