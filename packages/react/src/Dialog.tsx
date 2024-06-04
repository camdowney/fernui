import React from 'react'
import { KeyObject, cn, oc } from '@fernui/util'
import { useDialog, type SetState } from '@fernui/react-util'

export interface DialogProps {
  domRef?: any
  popover?: boolean
  active: boolean
  setActive: SetState<boolean>
  outerClass?: string
  outerStyle?: KeyObject
  children?: any
  className?: string
  activeClass?: string
  inactiveClass?: string
  style?: KeyObject
  bgClass?: string
  bgActiveClass?: string
  bgInactiveClass?: string
  bgStyle?: KeyObject
  openDelayMilliseconds?: number
  closeDelayMilliseconds?: number
  exitOnBgClick?: boolean
  exitOnOutsideClick?: boolean
  exitOnEscape?: boolean
  preventScroll?: boolean
  [props: string]: any
}

export default function Dialog({
  domRef,
  popover = false,
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
}: DialogProps) {
  const { ref } = useDialog(active, setActive, {
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
      className={cn(
        'fui-dialog-outer',
        popover && 'fui-popover-outer',
        outerClass,
      )}
      style={oc(styles.outer(popover), outerStyle)}
    >
      {/* Background */}
      <div
        className={cn(
          'fui-dialog-bg',
          popover && 'fui-popover-bg',
          `fui-dialog-bg-${active ? '' : 'in'}active`,
          popover && `fui-popover-bg-${active ? '' : 'in'}active`,
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

      {/* Dialog */}
      <div
        className={cn(
          'fui-dialog',
          popover && 'fui-popover',
          `fui-dialog-${active ? '' : 'in'}active`,
          popover && `fui-popover-${active ? '' : 'in'}active`,
          active ? activeClass : inactiveClass,
          className,
        )}
        aria-hidden={!active}
        style={oc(styles.dialog(popover), style)}
        {...props}
      >
        {children}
      </div>
    </span>
  )
}

const styles = {
  outer: (popover: boolean) => ({
    position: popover ? 'relative' : 'initial',
    display: popover ? 'block' : 'initial',
  }),
  bg: {
    position: 'fixed',
    top: '-1000rem',
    bottom: '-1000rem',
    left: '-1000rem',
    right: '-1000rem',
  },
  dialog: (popover: boolean) => ({
    position: popover ? 'absolute' : 'fixed',
  }),
}