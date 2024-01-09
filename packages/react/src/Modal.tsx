import React from 'react'
import { cn, oc } from '@fernui/util'
import { SetState } from '@fernui/react-core-util'
import { useModal } from '@fernui/react-util'

export interface ModalProps {
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
  domRef,
  active,
  setActive,
  outerClass,
  outerStyle,
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
    ref: domRef,
    openDelay,
    closeDelay,
    exitOnOutsideClick,
    exitOnEscape,
    preventScroll,
  })

  return (
    <span
      ref={ref}
      className={cn('fui-modal-outer', outerClass)}
      style={outerStyle}
    >
      <div
        className={cn('fui-modal-bg', active ? bgActiveClass : bgInactiveClass, bgClass)}
        onClick={e => {
          e.preventDefault()
          if (exitOnBgClick) setActive(false)
        }}
        aria-hidden={!active}
        style={oc(styles.bg, bgStyle)}
      />
      <div
        className={cn('fui-modal', active ? activeClass : inactiveClass, className)}
        aria-hidden={!active}
        style={oc(styles.modal(active), style)}
        {...props}
      >
        {children}
      </div>
    </span>
  )
}

const styles = {
  modal: (active: boolean | null) => ({
    ...active === null && { visibility : 'hidden !important' },
  }),
  bg: {
    position: 'fixed',
    top: '-50%',
    bottom: '-50%',
    left: '-50%',
    right: '-50%',
  },
}