import React from 'react'
import Cond from './Cond'
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
  return (
    <Cond
      as={as || (to ? 'a' : 'button')}
      href={to}
      target={blank && '_blank'}
      rel={blank && 'noopener noreferrer'}
      aria-label={label || text}
      {...props}
    >
      <Cond hide={!text} as='span'>
        {text}
      </Cond>
      {children}
      {icon && <Icon i={icon} className={iconClass} />}
    </Cond>
  )
}