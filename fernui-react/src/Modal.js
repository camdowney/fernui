import React, { useState, useRef } from 'react'
import Cond from './Cond'
import { cn, useCustomListener, onLoad, onKeydown } from './_util'

export default function Modal({
  id,
  outerClass,
  children,
  className,
  style,
  bgClass,
  transition = 'modal',
  openDelay = 0,
  closeDelay = 0,
  relative = false,
  persist = false,
  lock = false,
  focus = false
}) {
  const [active, setActive] = useState(null)
  const [timer, setTimer] = useState(null)

  const ref = useRef()

  const f = `#${id} > menu`
  const focusable = `${f} a, ${f} button, ${f} input, ${f} select, ${f} textarea`

  const setModalActive = value => {
    clearTimeout(timer)
    setActive(value)
    document.body.style.overflow = (lock && value) ? 'hidden' : 'auto'

    if (value && focus)
      setTimeout(() => document.querySelector(focusable)?.focus(), 50)
      
    if (value && closeDelay > 0)
      setTimer(setTimeout(() => setModalActive(false), closeDelay))
  }

  onLoad(() => {
    if (openDelay > 0)
      setTimer(setTimeout(() => setModalActive(true), openDelay))
  })

  onKeydown(e => {
    if (active && !e.repeat && !persist && e?.key?.toLowerCase() === 'escape')
      setModalActive(false)
  })

  useCustomListener(ref, 'FernModalAction', e => {
    const action = e.detail.action
    setActive(action < 2 ? action : !active)
  })

  return (
    <span
      ref={ref}
      id={id}
      className={cn('fui-modal', active ? 'fui-modal-active' : 'fui-modal-inactive', outerClass)}
      style={wrapperStyles(relative)}
    >
      <span className='fui-modal-toggle' onClick={() => setModalActive(!active)} style={{ display: 'none' }} />
      <span className='fui-modal-open' onClick={() => setModalActive(true)} style={{ display: 'none' }} />
      <span className='fui-modal-close' onClick={() => setModalActive(false)} style={{ display: 'none' }} />

      <Cond
        hide={!bgClass || !active}
        className={cn('fui-modal-bg', bgClass)}
        onClick={() => !persist && setModalActive(false)}
        style={bgStyles(relative)}
      />

      <menu
        className={cn(transition + '-' + (active ? 'open' : 'close'), className)}
        aria-hidden={!active}
        style={{ ...style, ...menuStyles(relative, active) }}
      >
        {children}
      </menu>
    </span>
  )
}

const wrapperStyles = relative => ({
  position: relative ? 'relative' : 'absolute',
  display: relative ? 'block' : 'initial',
})

const bgStyles = relative => ({
  position: 'fixed',
  top: '-30%',
  bottom: '-30%',
  left: '-30%',
  right: '-30%',
  zIndex: relative ? '30' : '50',
})

const menuStyles = (relative, active) => ({
  overflowY: 'auto',
  zIndex: relative ? '31' : '51',
  position: relative ? 'absolute' : 'fixed',
  visibility: active === null && 'hidden !important',
})