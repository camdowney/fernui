import React from 'react'
import Svg, { SvgProps } from './Svg'

export interface ButtonProps {
  domRef?: any
  as?: any
  href?: string
  children?: any
  text?: any
  before?: any
  iconBefore?: SvgProps
  after?: any
  iconAfter?: SvgProps
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
      {iconBefore && <Svg {...iconBefore} />}
      {children}
      {text && <span>{text}</span>}
      {after}
      {iconAfter && <Svg {...iconAfter} />}
    </Shell>
  )
}