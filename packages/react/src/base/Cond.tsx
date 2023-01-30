import React from 'react'

interface CondProps {
  innerRef?: any
  as?: any
  hide?: boolean
  children?: any
  [x:string]: any
}

export default function Cond({
  innerRef,
  as = 'div',
  hide,
  children,
  ...props
}: CondProps) {
  const Shell = as

  return hide ? <></> : (
    <Shell ref={innerRef} {...props}>
      {children}
    </Shell>
  )
}