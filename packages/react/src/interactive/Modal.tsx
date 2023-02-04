import React, { useState, useEffect, useRef } from 'react'
import { cn, useListener } from '../util'

interface ModalProps {
  innerRef?: any
  id?: string
  wrapperClass?: string
  children?: any
  className?: string
  style?: object
  onAction?: Function
  bgClass?: string
  bgStyle?: object,
  transition?: string
  openDelay?: number
  closeDelay?: number
  relative?: boolean
  exitOnBgClick?: boolean,
  exitOnOutsideClick?: boolean,
  exitOnEscape?: boolean,
  scrollLock?: boolean
  focus?: boolean
}

export default function Modal({
  innerRef,
  id,
  wrapperClass,
  children,
  className,
  style,
  onAction,
  bgClass,
  bgStyle,
  transition = 'modal',
  openDelay = 0,
  closeDelay = 0,
  relative = false,
  exitOnBgClick = true,
  exitOnOutsideClick = true,
  exitOnEscape = true,
  scrollLock = false,
  focus = false
}: ModalProps) {
  const [active, setActive] = useState<boolean | any>(null)
  const wrapperRef = innerRef || useRef()
  const timer = useRef<any>()

  const setModalTimer = (willBeActive: boolean, delay: number) =>
    timer.current = setTimeout(() => setModalActive(willBeActive), delay)

  const setModalActive = (willBeActive: boolean) => {
    clearTimeout(timer.current)
    setActive(willBeActive)

    if (scrollLock)
      document.body.style.overflow = willBeActive ? 'hidden' : 'auto'

    if (!willBeActive)
      return

    if (focus)
      setTimeout(() => wrapperRef.current.querySelector('[tabindex="0"] [tabindex="1"]')?.focus(), 50)
      
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
    if (active && exitOnOutsideClick && !wrapperRef.current.lastChild.contains(e.target))
      setTimeout(() => setModalActive(false), 0)
  })

  useListener('FUIModalAction', (e: any) => {
    const action = e.detail.action
    setModalActive(action < 2 ? action : !active)
    onAction && onAction(e)
  }, wrapperRef)

  return (
    <span
      ref={wrapperRef}
      id={id}
      className={cn('fui-listener', wrapperClass)}
      style={wrapperStyle(relative) as Object}
    >
      <div
        className={cn('fui-modal-bg', transition + '-bg-' + (active ? 'open' : 'close'), bgClass)}
        onClick={() => exitOnBgClick && setModalActive(false)}
        aria-hidden={!active}
        style={{ ...modalBgStyle(relative), ...bgStyle } as Object}
      />

      <div
        className={cn('fui-modal', transition + '-' + (active ? 'open' : 'close'), className)}
        aria-hidden={!active}
        style={{ ...modalStyle(relative, active), ...style } as Object}
      >
        {children}
      </div>
    </span>
  )
}

const wrapperStyle = (relative: boolean) => ({
  position: relative ? 'relative' : 'absolute',
  display: relative ? 'block' : 'initial',
})

const modalBgStyle = (relative: boolean) => ({
  position: 'fixed',
  top: '-50%',
  bottom: '-50%',
  left: '-50%',
  right: '-50%',
  zIndex: relative ? 30 : 50,
})

const modalStyle = (relative: boolean, active: boolean | null) => ({
  overflowY: 'auto',
  zIndex: relative ? 31 : 51,
  position: relative ? 'absolute' : 'fixed',
  visibility: active === null && 'hidden !important',
})