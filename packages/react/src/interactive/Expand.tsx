import React, { useState, useEffect, useRef } from 'react'
import { cn, useListener } from '../util'

interface ExpandProps {
  innerRef?: any
  id?: string
  className?: string
  children?: any
  onAction?: Function
}

export default function Expand({
  innerRef,
  id,
  className,
  children,
  onAction
}: ExpandProps) {
  const [active, setActive] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const expandRef = innerRef || useRef()

  const setExpandHeight = () =>
    setContentHeight(expandRef.current.querySelector('div').clientHeight)

  useEffect(setExpandHeight, [])
  useListener('resize', setExpandHeight)

  useListener('FUIExpandAction', (e: any) => {
    const action = e.detail.action
    setActive(action < 2 ? action : !active)
    onAction && onAction(e)
  }, expandRef)

  return (
    <div
      ref={expandRef}
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