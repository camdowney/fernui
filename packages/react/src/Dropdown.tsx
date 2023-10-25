import React  from 'react'
import { cn } from '@fernui/util'
import { SetState } from '@fernui/react-core-util'
import { useModal } from '@fernui/react-util'

export interface DropdownProps {
  domRef?: any
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
  domRef,
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
    ref: domRef,
    openDelay,
    closeDelay,
    exitOnOutsideClick,
    exitOnEscape,
  })

  return (
    <span
      ref={ref}
      className={cn('fui-dropdown-outer', outerClass)}
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
  position: 'absolute',
  overflowY: 'auto',
  ...(active === null && { visibility : 'hidden !important' }),
})