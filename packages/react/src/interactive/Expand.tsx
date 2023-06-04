import React, { useState, useEffect, useRef } from 'react'
import { cn, useListener } from '@fernui/react-util'

export interface ExpandProps {
  innerRef?: any
  id?: string
  className?: string
  children?: any
  onChange?: (newActive: boolean) => any
  onAction?: (e: any) => any
}

export default function Expand({
  innerRef,
  id,
  className,
  children,
  onChange,
  onAction,
}: ExpandProps) {
  const [active, setActive] = useState(false)
  const [height, _setHeight] = useState(0)
  const ref = innerRef || useRef()

  const setHeight = () =>
    _setHeight(ref.current.firstChild.clientHeight)

  useEffect(setHeight, [])
  useListener('resize', setHeight)

  useListener('FUIAction', (e: any) => {
    const action = e.detail.action
    const newActive = action < 2 ? action : !active

    setActive(newActive)
    onChange?.(newActive)
    onAction?.(e)
  }, { element: ref })

  return (
    <div
      ref={ref}
      id={id}
      className={cn('fui-listener fui-expand', className)}
      style={_style(active, height)}
      tabIndex={active ? undefined : -1}
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