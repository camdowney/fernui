import React, { useState, useEffect, useRef } from 'react'
import Cond from './Cond'
import { cn, useListener } from './_util'

export default function Modal({
  innerRef,
  id,
  wrapperClass,
  children,
  className,
  style,
  onAction,
  bgClass,
  transition = 'modal',
  openDelay = 0,
  closeDelay = 0,
  relative = false,
  exitOn = { bg: true, click: false, escape: true },
  scrollLock = false,
  focus = false
}) {
  const [active, setActive] = useState(null)
  const wrapperRef = innerRef || useRef()
  const timer = useRef()

  const setModalTimer = (newActive, delay) =>
    timer.current = setTimeout(() => setModalActive(newActive), delay)

  const setModalActive = willBeActive => {
    clearTimeout(timer.current)

    if (active === willBeActive)
      return

    setActive(willBeActive)

    if (scrollLock)
      document.body.style.overflow = willBeActive ? 'hidden' : 'auto'

    if (willBeActive && focus)
      setTimeout(() => wrapperRef.current.querySelector('menu [tabindex="0"], menu [tabindex="1"]')?.focus(), 50)
      
    if (willBeActive && closeDelay > 0)
      setModalTimer(false, closeDelay)
  }

  useEffect(() => {
    if (openDelay > 0)
      setModalTimer(true, openDelay)
  }, [])

  useListener('keydown', e => {
    if (active && !e.repeat && exitOn?.escape && e?.key?.toLowerCase() === 'escape')
      setModalActive(false)
  })

  useListener('mouseup', e => {
    if (active && exitOn?.click && !wrapperRef.current.lastChild.contains(e.target))
      setTimeout(() => setModalActive(false), 0)
  })

  useListener('FernModalAction', e => {
    const action = e.detail.action
    setModalActive(action < 2 ? action : !active)
    onAction && onAction(e)
  }, wrapperRef)

  return (
    <span
      ref={wrapperRef}
      id={id}
      className={cn('fui-listener fui-modal-wrapper', wrapperClass)}
      style={wrapperStyle(relative)}
    >
      <Cond
        hide={!bgClass || !active}
        className={cn('fui-modal-bg', bgClass)}
        onClick={() => exitOn?.bg && setModalActive(false)}
        style={bgStyle(relative)}
      />

      <menu
        className={cn('fui-modal', transition + '-' + (active ? 'open' : 'close'), className)}
        aria-hidden={!active}
        style={{ ...menuStyle(relative, active), ...style }}
      >
        {children}
      </menu>
    </span>
  )
}

const wrapperStyle = relative => ({
  position: relative ? 'relative' : 'absolute',
  display: relative ? 'block' : 'initial',
})

const bgStyle = relative => ({
  position: 'fixed',
  top: '-50%',
  bottom: '-50%',
  left: '-50%',
  right: '-50%',
  zIndex: relative ? '30' : '50',
})

const menuStyle = (relative, active) => ({
  overflowY: 'auto',
  zIndex: relative ? '31' : '51',
  position: relative ? 'absolute' : 'fixed',
  visibility: active === null && 'hidden !important',
})