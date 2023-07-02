import React  from 'react'
import { SetState, cn, useModal } from '@fernui/react-util'

export interface DropdownProps {
  innerRef?: any
  active: boolean
  setActive: SetState<boolean>
  outerClass?: string
  children?: any
  className?: string
  activeClass?: string
  inactiveClass?: string
  style?: Object
  openDelay?: number
  closeDelay?: number
  exitOnOutsideClick?: boolean
  exitOnEscape?: boolean
  [props: string]: any
}

export default function Dropdown({
  innerRef,
  active,
  setActive,
  outerClass,
  children,
  className,
  activeClass = 'fui-dropdown-active',
  inactiveClass = 'fui-dropdown-inactive',
  style,
  openDelay = 0,
  closeDelay = 0,
  exitOnOutsideClick = true,
  exitOnEscape = true,
  ...props
}: DropdownProps) {
  const { ref } = useModal(active, setActive, {
    ref: innerRef,
    openDelay,
    closeDelay,
    exitOnOutsideClick,
    exitOnEscape,
  })

  return (
    <span
      ref={ref}
      className={cn('fui-listener fui-dropdown-outer', outerClass)}
      style={_outerStyle as Object}
    >
      <div
        className={cn('fui-dropdown', active ? activeClass : inactiveClass, className)}
        aria-hidden={!active}
        style={{ ..._style(active), ...style } as Object}
        {...props}
      >
        {children}
      </div>
    </span>
  )
}

const _outerStyle = {
  position: 'relative',
  display: 'block',
}

const _style = (active: boolean | null) => ({
  overflowY: 'auto',
  position: 'absolute',
  visibility: active === null && 'hidden !important',
})