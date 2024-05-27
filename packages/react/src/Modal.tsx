import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn, oc } from '@fernui/util'
import { type SetState, useModal, useListener } from '@fernui/react-util'

const isFixed = (element: Element | Document) => {
  if (element instanceof Document)
    return false

  if (window.getComputedStyle(element).position === 'fixed')
    return true

  return (element.parentElement)
}

const getZIndex = (element: Element) =>
  parseInt(window.getComputedStyle(element).getPropertyValue('z-index'))

export type ModalAlign = 'end-start' | 'end-end' | 'center' | 'stretch' | 'start-start' | 'start-end'

export interface ModalProps {
  rootSelector?: string
  alignX?: ModalAlign
  alignY?: ModalAlign
  domRef?: any
  active: boolean
  setActive: SetState<boolean>
  outerClass?: string
  outerStyle?: Object
  children?: any
  className?: string
  activeClass?: string
  inactiveClass?: string
  style?: Object
  bgClass?: string
  bgActiveClass?: string
  bgInactiveClass?: string
  bgStyle?: Object
  openDelayMilliseconds?: number
  closeDelayMilliseconds?: number
  exitOnBgClick?: boolean
  exitOnOutsideClick?: boolean
  exitOnEscape?: boolean
  preventScroll?: boolean
  focus?: boolean
  [props: string]: any
}

export default function Modal({
  rootSelector,
  alignX = 'start-start',
  alignY = 'start-end',
  domRef,
  active,
  setActive,
  outerClass,
  outerStyle,
  children,
  className,
  activeClass,
  inactiveClass,
  style,
  bgClass,
  bgActiveClass,
  bgInactiveClass,
  bgStyle,
  openDelayMilliseconds = 0,
  closeDelayMilliseconds = 0,
  exitOnBgClick = true,
  exitOnOutsideClick = true,
  exitOnEscape = true,
  preventScroll,
  ...props
}: ModalProps) {
  const [isClient, setClient] = useState(false)
  const bgRef = useRef<any>()

  const { ref: modalRef } = useModal(active, setActive, {
    ref: domRef,
    openDelayMilliseconds,
    closeDelayMilliseconds,
    exitOnOutsideClick,
    exitOnEscape,
    preventScroll,
  })

  const setModalPosition = () => {
    if (!active || !rootSelector || !modalRef.current) return

    const root = document.querySelector(rootSelector)

    if (!root) return
  
    const rootRect = root.getBoundingClientRect()
    const modalWidth = modalRef.current.offsetWidth
    const modalHeight = modalRef.current.offsetHeight

    let newLeft = rootRect.left
    let newTop = rootRect.top

    if (alignX === 'end-start')
      newLeft = newLeft - modalWidth
    else if (alignX === 'end-end')
      newLeft = newLeft + rootRect.width - modalWidth
    else if (alignX === 'center')
      newLeft = newLeft + (rootRect.width / 2) - (modalWidth / 2)
    else if (alignX === 'start-end')
      newLeft = newLeft + rootRect.width

    if (alignY === 'end-start')
      newTop = newTop - modalHeight
    else if (alignY === 'end-end')
      newTop = newTop + rootRect.height - modalHeight
    else if (alignY === 'center')
      newTop = newTop + (rootRect.height / 2) - (modalHeight / 2)
    else if (alignY === 'start-end')
      newTop = newTop + rootRect.height

    modalRef.current.style.left = `${newLeft}px`
    modalRef.current.style.top = `${newTop}px`

    if (alignX === 'stretch')
      modalRef.current.style.width = `${rootRect.width}px`
    if (alignY === 'stretch')
      modalRef.current.style.height = `${rootRect.height}px`

    modalRef.current.style.transformOrigin =
      `${
        alignX.startsWith('start') ? 'left' : alignX.startsWith('end') ? 'right' : 'center'
      } ${
        alignY.startsWith('start') ? 'top' : alignY.startsWith('end') ? 'bottom' : 'center'
      }`


    if (modalRef.current.style.position !== 'fixed' && isFixed(root)) {
      modalRef.current.style.position = 'fixed'
      modalRef.current.style.zIndex = getZIndex(modalRef.current) + 10
      bgRef.current.style.zIndex = getZIndex(bgRef.current) + 10
    }
  }

  useEffect(() => setClient(true), [])
  useEffect(setModalPosition, [active])
  useListener('windowresize', setModalPosition)

  if (!isClient) return <></>

  return createPortal(
    <span className={cn('fui-modal-outer', outerClass)}>
      {/* Background */}
      <div
        ref={bgRef}
        className={cn(
          'fui-modal-bg',
          `fui-modal-bg-${active ? '' : 'in'}active`,
          active ? bgActiveClass : bgInactiveClass,
          bgClass
        )}
        onClick={e => {
          e.preventDefault()
          if (exitOnBgClick) setActive(false)
        }}
        aria-hidden={!active}
        style={oc(styles.bg, bgStyle)}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'fui-modal', 
          `fui-modal-${active ? '' : 'in'}active`,
          active ? activeClass : inactiveClass,
          className
        )}
        aria-hidden={!active}
        style={oc({ position: rootSelector ? 'absolute' : 'fixed' }, style)}
        {...props}
      >
        {children}
      </div>
    </span>
  , document.body)
}

const styles = {
  bg: {
    position: 'fixed',
    top: '-50%',
    bottom: '-50%',
    left: '-50%',
    right: '-50%',
  },
}