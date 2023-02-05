import React from 'react'
import Icon from './Icon'

interface LinkProps {
  as?: any
  to?: string
  text?: string
  icon?: { children: string }
  iconClass?: string
  blank?: boolean
  label?: string
  children?: any
  [x:string]: any
}

export default function Link({
  as,
  to,
  text,
  icon,
  iconClass,
  blank,
  label,
  children,
  ...props
}: LinkProps) {
  const Shell = as || (to ? 'a' : 'button')

  return (
    <Shell
      href={to}
      target={blank && '_blank'}
      rel={blank && 'noopener noreferrer'}
      aria-label={label || text}
      {...props}
    >
      {text && <span>{text}</span>}
      {children}
      {icon && <Icon i={icon} className={iconClass} />}
    </Shell>
  )
}