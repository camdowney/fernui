import React, { useState, useEffect, useRef } from 'react'
import { cn, useListener } from './_util'

export default function Expand({
  innerRef,
  id,
  className,
  children,
  close
}) {
  const [active, setActive] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const expandRef = innerRef || useRef()

  const setExpandHeight = () =>
    setContentHeight(expandRef.current.querySelector('div').clientHeight)

  useEffect(setExpandHeight, [])
  useListener('resize', setExpandHeight)

  useListener('mousedown', e => {
    if (close && !expandRef.current.contains(e.target))
      setActive(false)
  })

  useListener('FernExpandAction', e => {
    const action = e.detail.action
    setActive(action < 2 ? action : !active)
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

const expandStyle = (active, contentHeight) => ({
  overflow: 'hidden',
  maxHeight: active ? contentHeight + 'px' : 0,
  transitionProperty: 'max-height',
})