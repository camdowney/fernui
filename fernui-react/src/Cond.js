import React from 'react'

export default function Cond({
  condRef,
  as = 'div',
  hide,
  children,
  formState,
  ...props
}) {
  const Shell = as

  return !hide ? (
    <Shell ref={condRef} {...props}>
      {children}
    </Shell>
  ) : (
    <></>
  )
}