import React from 'react'
import { SetState, cn, useModal } from '@fernui/react-util'

export interface ModalProps {
  innerRef?: any
  active: boolean
  setActive: SetState<boolean>
  outerClass?: string
  children?: any
  className?: string
  activeClass?: string
  inactiveClass?: string
  style?: Object
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
  [props: string]: any
}

export default function Modal({
  innerRef,
  active,
  setActive,
  outerClass,
  children,
  className,
  activeClass = 'fui-modal-active',
  inactiveClass = 'fui-modal-inactive',
  style,
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
  ...props
}: ModalProps) {
  const { ref } = useModal(active, setActive, {
    ref: innerRef,
    openDelay,
    closeDelay,
    exitOnOutsideClick,
    exitOnEscape,
    preventScroll,
  })

  return (
    <span
      ref={ref}
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
        {...props}
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