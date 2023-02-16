import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@fernui/util'
import { useListener } from '../util'

export interface ExpandProps {
  innerRef?: any
  id?: string
  className?: string
  children?: any
  onChange?: (newActive: boolean) => void
  onAction?: (e: any) => void
}

export default function Expand({
  innerRef,
  id,
  className,
  children,
  onChange,
  onAction
}: ExpandProps) {
  const [active, setActive] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const ref = innerRef || useRef()

  const setExpandHeight = () =>
    setContentHeight(ref.current.querySelector('div').clientHeight)

  useEffect(setExpandHeight, [])
  useListener('resize', setExpandHeight)

  useListener('FUIExpandAction', (e: any) => {
    const action = e.detail.action
    const newActive = action < 2 ? action : !active

    setActive(newActive)
    onChange?.(newActive)
    onAction?.(e)
  }, ref)

  return (
    <div
      ref={ref}
      id={id}
      className={cn('fui-listener fui-expand', className)}
      style={expandStyle(active, contentHeight)}
      tabIndex={active ? undefined : -1}
    >
      <div>
        {children}
      </div>
    </div>
  )
}

const expandStyle = (active: boolean, contentHeight: number) => ({
  overflow: 'hidden',
  maxHeight: active ? contentHeight + 'px' : 0,
  transitionProperty: 'max-height',
})