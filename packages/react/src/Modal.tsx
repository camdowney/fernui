import React from 'react'
import { cn, oc } from '@fernui/util'
import { useModal, type SetState } from '@fernui/react-util'

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
  const { ref } = useModal(active, setActive, {
    ref: domRef,
    openDelayMilliseconds,
    closeDelayMilliseconds,
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
      {/* Background */}
      <div
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
        className={cn(
          'fui-modal', 
          `fui-modal-${active ? '' : 'in'}active`,
          active ? activeClass : inactiveClass,
          className
        )}
        aria-hidden={!active}
        style={oc(style)}
        {...props}
      >
        {children}
      </div>
    </span>
  )
}

const styles = {
  bg: {
    position: 'fixed',
    top: '-1000rem',
    bottom: '-1000rem',
    left: '-1000rem',
    right: '-1000rem',
  },
}