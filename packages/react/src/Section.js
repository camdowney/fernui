import React from 'react'
import Cond from './Cond'
import { cn } from './_util'

export default function Section({
  as = 'section',
  id,
  className,
  containerClass,
  bg,
  children
}) {
  return (
    <Cond
      as={as}
      id={id}
      className={cn('fui-section', className)}
    >
      {bg}
      <div className={cn('fui-container', containerClass)}>
        {children}
      </div>
    </Cond>
  )
}