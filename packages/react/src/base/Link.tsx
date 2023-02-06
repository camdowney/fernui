import React from 'react'
import Icon, { IconProps } from './Icon'

export interface LinkProps {
  innerRef?: any
  as?: any
  to?: string
  children?: any
  text?: string
  icon?: IconProps
  blank?: boolean
  label?: string
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
  ...props
}: LinkProps) {
  const Shell = as || (to ? 'a' : 'button')

  return (
    <Shell
      ref={innerRef}
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