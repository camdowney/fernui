import React from 'react'
import { cn, oc } from '@fernui/util'

export interface SvgProps {
  src: string
  className?: string
  style?: Object
  [props: string]: any
}

export default function Svg({
  src,
  className,
  style,
  ...props
}: SvgProps) {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: src }}
      className={cn('fui-svg', className)}
      style={oc({ display: 'block' }, style)}
      {...props}
    />
  )
}