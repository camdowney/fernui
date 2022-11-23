import React from 'react'

/*
  Functions as a regular div, but adds a few cool options:
  * Set the element's tag with 'as' prop
  * Conditionally hide the element with 'hide' prop

  When used inside a Form element, children must have tags.
  e.g 
  <Cond><p>text</p></Cond> 
  instead of 
  <Cond>text</Cond>
*/
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
      {isNaN(formState) ? (
        children
      ) : (
        React.Children.map(children, c => 
          React.cloneElement(c, { formState })
        )
      )}
    </Shell>
  ) : (
    <></>
  )
}