import React from 'react'
import Cond from './Cond'
import { cn } from './_util'

export default function Content({
  id,
  className,
  heading,
  headingClass,
  children,
  bodyClass,
}) {
  return (
    <div id={id} className={cn('fui-content', className)}>
      <Cond hide={!heading} className={cn('fui-heading', headingClass)}>
        {heading}
      </Cond>
      <Cond hide={!children} className={cn('fui-body', bodyClass)}>
        {children}
      </Cond>
    </div>
  )
}