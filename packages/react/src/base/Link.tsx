import React, { useRef } from 'react'
import { useListener } from '@fernui/react-util'
import Icon, { IconProps } from './Icon'

export interface LinkProps {
  innerRef?: any
  as?: any
  to?: string
  children?: any
  text?: any
  before: any
  iconBefore?: IconProps
  after: any
  iconAfter?: IconProps
  blank?: boolean
  label?: string
  preventDefaultFocus?: boolean,
  [x:string]: any
}

export default function Link({
  innerRef,
  as,
  to,
  children,
  text,
  before,
  iconBefore,
  after,
  iconAfter,
  blank,
  label,
  preventDefaultFocus,
  ...props
}: LinkProps) {
  const Shell = as || (to ? 'a' : 'button')
  const ref = innerRef || useRef()

  useListener('mousedown', (e: any) => {
    if (preventDefaultFocus)
      e.preventDefault()
  }, { element: ref })

  return (
    <Shell
      ref={ref}
      href={to}
      target={blank && '_blank'}
      rel={blank && 'noopener noreferrer'}
      aria-label={label || text}
      {...props}
    >
      {before}
      {iconBefore && <Icon {...iconBefore} />}
      {children}
      {text && <span>{text}</span>}
      {after}
      {iconAfter && <Icon {...iconAfter} />}
    </Shell>
  )
}