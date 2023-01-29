import React from 'react'
import { Cond } from '..'
import { cn } from '../util'

interface Props {
  as?: any
  id?: string
  className?: string
  containerClass?: string
  bg?: any
  children?: any
}

export default function Section({
  as = 'section',
  id,
  className,
  containerClass,
  bg,
  children
}: Props) {
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