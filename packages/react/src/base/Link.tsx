import React, { useRef } from 'react'
import Icon, { IconProps } from './Icon'
import { useListener } from '../util'

export interface LinkProps {
  innerRef?: any
  as?: any
  to?: string
  children?: any
  text?: any
  icon?: IconProps
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
  icon,
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
      {icon && <Icon {...icon} />}
      {children}
      {text && <span>{text}</span>}
      {iconAfter && <Icon {...iconAfter} />}
    </Shell>
  )
}