import React, { useState, useRef } from 'react'
import Cond from './Cond'
import { cn, useCustomListener, onLoad, onKeydown } from './_util'

export default function Modal({
  id,
  outerClass,
  children,
  className,
  style,
  onAction,
  bgClass,
  transition = 'modal',
  openDelay = 0,
  closeDelay = 0,
  dropdown = false,
  persist = false,
  scrollLock = false,
  focus = false
}) {
  const [active, setActive] = useState(null)
  const outerRef = useRef()
  const timer = useRef()

  const setModalTimer = (newActive, delay) =>
    setTimer(setTimeout(() => setModalActive(newActive), delay))

  const setModalActive = newActive => {
    clearTimeout(timer)
    setActive(newActive)

    if (scrollLock)
      document.body.style.overflow = newActive ? 'hidden' : 'auto'

    if (newActive && focus)
      setTimeout(() => outerRef.current.querySelector('menu [tabindex=0], menu [tabindex=1]')?.focus(), 50)
      
    if (newActive && closeDelay > 0)
      setModalTimer(false, closeDelay)
  }

  onLoad(() => {
    if (openDelay > 0)
      setModalTimer(true, openDelay)
  })

  onKeydown(e => {
    if (active && !e.repeat && !persist && e?.key?.toLowerCase() === 'escape')
      setModalActive(false)
  })

  useCustomListener(outerRef.current, 'FernModalAction', e => {
    const action = e.detail.action
    setModalActive(action < 2 ? action : !active)
    onAction && onAction(e)
  })

  return (
    <span
      ref={outerRef}
      id={id}
      className={cn('fui-modal-wrapper', active ? 'fui-modal-active' : 'fui-modal-inactive', outerClass)}
      style={wrapperStyles(dropdown)}
    >
      <Cond
        hide={!bgClass || !active}
        className={cn('fui-modal-bg', bgClass)}
        onClick={() => !persist && setModalActive(false)}
        style={bgStyles(dropdown)}
      />

      <menu
        className={cn('fui-modal', transition + '-' + (active ? 'open' : 'close'), className)}
        aria-hidden={!active}
        style={{ ...menuStyles(dropdown, active), ...style }}
      >
        {children}
      </menu>
    </span>
  )
}

const wrapperStyles = dropdown => ({
  position: dropdown ? 'relative' : 'absolute',
  display: dropdown ? 'block' : 'initial',
})

const bgStyles = dropdown => ({
  position: 'fixed',
  top: '-50%',
  bottom: '-50%',
  left: '-50%',
  right: '-50%',
  zIndex: dropdown ? '30' : '50',
})

const menuStyles = (dropdown, active) => ({
  overflowY: 'auto',
  zIndex: dropdown ? '31' : '51',
  position: dropdown ? 'absolute' : 'fixed',
  visibility: active === null && 'hidden !important',
})