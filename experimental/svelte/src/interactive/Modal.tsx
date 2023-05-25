import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@fernui/util'
import { useListener } from '../util'

export interface ModalProps {
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
  bgClass?: string
  bgActiveClass?: string
  bgInactiveClass?: string
  bgStyle?: Object
  openDelay?: number
  closeDelay?: number
  exitOnBgClick?: boolean
  exitOnOutsideClick?: boolean
  exitOnEscape?: boolean
  preventScroll?: boolean
  focus?: boolean
}

export default function Modal({
  innerRef,
  id,
  outerClass,
  children,
  className,
  activeClass = 'fui-modal-active',
  inactiveClass = 'fui-modal-inactive',
  style,
  onChange,
  onAction,
  bgClass,
  bgActiveClass = 'fui-modal-bg-active',
  bgInactiveClass = 'fui-modal-bg-inactive',
  bgStyle,
  openDelay = 0,
  closeDelay = 0,
  exitOnBgClick = true,
  exitOnOutsideClick = true,
  exitOnEscape = true,
  preventScroll,
}: ModalProps) {
  const [active, _setActive] = useState<boolean | null>(null)
  const ref = innerRef || useRef()
  const timer = useRef<any>()

  const setActiveTimer = (newActive: boolean, delay: number) =>
    timer.current = setTimeout(() => setActive(newActive), delay)

  const setActive = (newActive: boolean) => {
    clearTimeout(timer.current)
    _setActive(newActive)
    onChange?.(newActive)

    if (preventScroll)
      document.body.style.overflow = newActive ? 'hidden' : 'auto'
      
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
    if (active && exitOnOutsideClick && !ref.current.lastChild.contains(e.target))
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
      className={cn('fui-listener fui-modal-outer', outerClass)}
    >
      <div
        className={cn('fui-modal-bg', active ? bgActiveClass : bgInactiveClass, bgClass)}
        onClick={() => exitOnBgClick && setActive(false)}
        aria-hidden={!active}
        style={{ ..._bgStyle, ...bgStyle } as Object}
      />
      <div
        className={cn('fui-modal', active ? activeClass : inactiveClass, className)}
        aria-hidden={!active}
        style={{ ..._style(active), ...style } as Object}
      >
        {children}
      </div>
    </span>
  )
}

const _bgStyle = {
  position: 'fixed',
  top: '-50%',
  bottom: '-50%',
  left: '-50%',
  right: '-50%',
}

const _style = (active: boolean | null) => ({
  overflowY: 'auto',
  position: 'fixed',
  visibility: active === null && 'hidden !important',
})