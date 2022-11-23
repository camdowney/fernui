import React from 'react'
import Cond from './Cond'
import { cn } from './_util'

export default function Section({
  as = 'section',
  id,
  className,
  shelfClass,
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
      <div className={cn('fui-shelf', shelfClass)}>
        {children}
      </div>
    </Cond>
  )
}