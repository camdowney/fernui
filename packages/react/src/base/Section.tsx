import React from 'react'
import Cond from './Cond'
import { cn } from '../util'

interface SectionProps {
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
}: SectionProps) {
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