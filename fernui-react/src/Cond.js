import React from 'react'

export default function Cond({
  innerRef,
  as = 'div',
  hide,
  children,
  formState,
  ...props
}) {
  const Shell = as

  return !hide ? (
    <Shell ref={innerRef} {...props}>
      {children}
    </Shell>
  ) : (
    <></>
  )
}