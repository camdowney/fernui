import React from 'react'
import Cond from './Cond'
import { cn } from '../util'

interface ContentProps {
  id?: string
  className?: string
  head?: any
  headClass?: string
  children?: any
  bodyClass?: string
}

export default function Content({
  id,
  className,
  head,
  headClass,
  children,
  bodyClass,
}: ContentProps) {
  return (
    <div id={id} className={cn('fui-content', className)}>
      <Cond hide={!head} className={cn('fui-head', headClass)}>
        {head}
      </Cond>
      <Cond hide={!children} className={cn('fui-body', bodyClass)}>
        {children}
      </Cond>
    </div>
  )
}