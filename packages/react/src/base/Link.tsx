import React, { useRef } from 'react'
import Icon, { IconProps } from './Icon'
import { useListener } from '../util'

export interface LinkProps {
  innerRef?: any
  as?: any
  to?: string
  children?: any
  text?: string
  icon?: IconProps
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
  }, ref)

  return (
    <Shell
      ref={ref}
      href={to}
      target={blank && '_blank'}
      rel={blank && 'noopener noreferrer'}
      aria-label={label || text}
      {...props}
    >
      {children}
      {text && <span>{text}</span>}
      {icon && <Icon {...icon} />}
    </Shell>
  )
}