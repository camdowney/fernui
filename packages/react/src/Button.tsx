import React from 'react'
import Icon, { IconProps } from './Icon'

export interface ButtonProps {
  innerRef?: any
  as?: any
  link?: string
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
  innerRef,
  as,
  link,
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
  const Shell = as || (link ? 'a' : 'button')

  return (
    <Shell
      ref={innerRef}
      href={link}
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