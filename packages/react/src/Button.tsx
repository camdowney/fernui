import React from 'react'
import Icon, { IconProps } from './Icon'

export interface ButtonProps {
  domRef?: any
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
  domRef,
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
      ref={domRef}
      href={link}
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