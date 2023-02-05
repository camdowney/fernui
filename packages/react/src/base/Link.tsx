import React from 'react'

export interface LinkProps {
  innerRef?: any
  as?: any
  to?: string
  text?: string
  children?: any
  blank?: boolean
  label?: string
  [x:string]: any
}

export default function Link({
  innerRef,
  as,
  to,
  text,
  children,
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
      {text ?? children}
    </Shell>
  )
}