import React from 'react'
import Icon, { IconProps } from './Icon'

export interface ButtonProps {
  domRef?: any
  as?: any
  href?: string
  children?: any
  text?: any
  before?: any
  iconBefore?: IconProps
  after?: any
  iconAfter?: IconProps
  blank?: boolean
  label?: string
  [props: string]: any
}

export default function Button({
  domRef,
  as,
  href,
  children,
  text,
  before,
  iconBefore,
  after,
  iconAfter,
  blank,
  label,
  ...props
}: ButtonProps) {
  const Shell = as || (href ? 'a' : 'button')

  return (
    <Shell
      ref={domRef}
      href={href}
      {...blank && {
        target: '_blank',
        rel: 'noopener noreferrer',
      }}
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