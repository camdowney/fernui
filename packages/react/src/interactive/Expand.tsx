import React, { useState, useEffect, useRef } from 'react'
import { cn, useListener } from '@fernui/react-util'

export interface ExpandProps {
  innerRef?: any
  active: boolean
  className?: string
  children?: any
  [props: string]: any
}

export default function Expand({
  innerRef,
  active,
  className,
  children,
  ...props
}: ExpandProps) {
  const [height, _setHeight] = useState(0)
  const ref = innerRef || useRef()

  const setHeight = () =>
    _setHeight(ref.current.firstChild.clientHeight)

  useEffect(setHeight, [])
  useListener('resize', setHeight)

  return (
    <div
      ref={ref}
      className={cn('fui-listener fui-expand', className)}
      style={_style(active, height)}
      tabIndex={active ? undefined : -1}
      {...props}
    >
      <div>
        {children}
      </div>
    </div>
  )
}

const _style = (active: boolean, height: number) => ({
  overflow: 'hidden',
  maxHeight: active ? height + 'px' : 0,
  transitionProperty: 'max-height',
})