import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@fernui/util'
import { useListener } from '../util'

export interface DropdownProps {
  innerRef?: any
  id?: string
  outerClass?: string
  children?: any
  className?: string
  activeClass?: string
  inactiveClass?: string
  style?: Object
  onChange?: (newActive: boolean) => any
  onAction?: (e: any) => any
  openDelay?: number
  closeDelay?: number
  exitOnOutsideClick?: boolean
  exitOnEscape?: boolean
}

export default function Dropdown({
  innerRef,
  id,
  outerClass,
  children,
  className,
  activeClass = 'fui-dropdown-active',
  inactiveClass = 'fui-dropdown-inactive',
  style,
  onChange,
  onAction,
  openDelay = 0,
  closeDelay = 0,
  exitOnOutsideClick = true,
  exitOnEscape = true,
}: DropdownProps) {
  const [active, _setActive] = useState<boolean | any>(null)
  const ref = innerRef || useRef()
  const timer = useRef<any>() 

  const setActiveTimer = (newActive: boolean, delay: number) =>
    timer.current = setTimeout(() => setActive(newActive), delay)

  const setActive = (newActive: boolean) => {
    clearTimeout(timer.current)
    _setActive(newActive)
    onChange?.(newActive)
      
    if (newActive && closeDelay > 0)
      setActiveTimer(false, closeDelay)
  }

  useEffect(() => {
    if (openDelay > 0)
      setActiveTimer(true, openDelay)
  }, [])

  useListener('keydown', (e: any) => {
    if (active && !e.repeat && exitOnEscape && e?.key?.toLowerCase() === 'escape')
      setActive(false)
  })

  useListener('mouseup', (e: any) => {
    if (active && exitOnOutsideClick && !e.target.closest('.fui-modal-outer') && !ref.current.contains(e.target))
      setTimeout(() => setActive(false), 0)
  })

  useListener('FUIAction', (e: any) => {
    const action = e.detail.action
    setActive(action < 2 ? action : !active)
    onAction?.(e)
  }, { element: ref })

  return (
    <span
      ref={ref}
      id={id}
      className={cn('fui-listener fui-dropdown-outer', outerClass)}
      style={_outerStyle as Object}
    >
      <div
        className={cn('fui-dropdown', active ? activeClass : inactiveClass, className)}
        aria-hidden={!active}
        style={{ ..._style(active), ...style } as Object}
      >
        {children}
      </div>
    </span>
  )
}

const _outerStyle = {
  position: 'relative',
  display: 'block',
}

const _style = (active: boolean | null) => ({
  overflowY: 'auto',
  position: 'absolute',
  visibility: active === null && 'hidden !important',
})