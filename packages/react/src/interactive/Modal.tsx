import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@fernui/util'
import { useListener } from '../util'

interface ModalProps {
  innerRef?: any
  id?: string
  wrapperClass?: string
  children?: any
  className?: string
  activeClass?: string
  inactiveClass?: string
  style?: Object
  onAction?: Function
  bgClass?: string
  bgActiveClass?: string
  bgInactiveClass?: string
  bgStyle?: Object,
  transition?: string
  openDelay?: number
  closeDelay?: number
  anchor?: boolean
  exitOnBgClick?: boolean,
  exitOnOutsideClick?: boolean,
  exitOnEscape?: boolean,
  preventScroll?: boolean
  focus?: boolean
}

export default function Modal({
  innerRef,
  id,
  wrapperClass,
  children,
  className,
  activeClass = 'fui-modal-active',
  inactiveClass = 'fui-modal-inactive',
  style,
  onAction,
  bgClass,
  bgActiveClass = 'fui-modal-bg-active',
  bgInactiveClass = 'fui-modal-bg-inactive',
  bgStyle,
  openDelay = 0,
  closeDelay = 0,
  anchor = false,
  exitOnBgClick = true,
  exitOnOutsideClick = true,
  exitOnEscape = true,
  preventScroll = false,
  focus = false
}: ModalProps) {
  const [active, setActive] = useState<boolean | any>(null)
  const ref = innerRef || useRef()
  const timer = useRef<any>()

  const setModalTimer = (willBeActive: boolean, delay: number) =>
    timer.current = setTimeout(() => setModalActive(willBeActive), delay)

  const setModalActive = (willBeActive: boolean) => {
    clearTimeout(timer.current)
    setActive(willBeActive)

    if (preventScroll)
      document.body.style.overflow = willBeActive ? 'hidden' : 'auto'

    if (!willBeActive)
      return

    if (focus)
      setTimeout(() => ref.current.querySelector('[tabindex="0"] [tabindex="1"]')?.focus(), 50)
      
    if (closeDelay > 0)
      setModalTimer(false, closeDelay)
  }

  useEffect(() => {
    if (openDelay > 0)
      setModalTimer(true, openDelay)
  }, [])

  useListener('keydown', (e: any) => {
    if (active && !e.repeat && exitOnEscape && e?.key?.toLowerCase() === 'escape')
      setModalActive(false)
  })

  useListener('mouseup', (e: any) => {
    if (active && exitOnOutsideClick && !ref.current.lastChild.contains(e.target))
      setTimeout(() => setModalActive(false), 0)
  })

  useListener('FUIModalAction', (e: any) => {
    const action = e.detail.action
    setModalActive(action < 2 ? action : !active)
    onAction?.(e)
  }, ref)

  return (
    <span
      ref={ref}
      id={id}
      className={cn('fui-listener', wrapperClass)}
      style={wrapperStyle(anchor) as Object}
    >
      <div
        className={cn('fui-modal-bg', active ? bgActiveClass : bgInactiveClass, bgClass)}
        onClick={() => exitOnBgClick && setModalActive(false)}
        aria-hidden={!active}
        style={{ ...modalBgStyle(anchor), ...bgStyle } as Object}
      />

      <div
        className={cn('fui-modal', active ? activeClass : inactiveClass, className)}
        aria-hidden={!active}
        style={{ ...modalStyle(anchor, active), ...style } as Object}
      >
        {children}
      </div>
    </span>
  )
}

const wrapperStyle = (anchor: boolean) => ({
  position: anchor ? 'relative' : 'absolute',
  display: anchor ? 'block' : 'initial',
})

const modalBgStyle = (anchor: boolean) => ({
  position: 'fixed',
  top: '-50%',
  bottom: '-50%',
  left: '-50%',
  right: '-50%',
  zIndex: anchor ? 30 : 50,
})

const modalStyle = (anchor: boolean, active: boolean | null) => ({
  overflowY: 'auto',
  zIndex: anchor ? 31 : 51,
  position: anchor ? 'absolute' : 'fixed',
  visibility: active === null && 'hidden !important',
})