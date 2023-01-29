import React from 'react'

interface Props {
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
}: Props) {
  const Shell = as

  return !hide ? (
    <Shell ref={innerRef} {...props}>
      {children}
    </Shell>
  ) : (
    <></>
  )
}