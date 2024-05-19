import React from 'react'
import { cn } from '@fernui/util'

export interface SvgProps {
  src: any
  className?: string
  [props: string]: any
}

export default function Svg({
  src,
  className,
  ...props
}: SvgProps) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: src }}
      className={cn('fui-svg', className)}
      {...props}
    />
  )
}