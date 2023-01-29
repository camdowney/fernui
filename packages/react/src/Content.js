import React from 'react'
import Cond from './Cond'
import { cn } from './_util'

export default function Content({
  id,
  className,
  head,
  headClass,
  children,
  bodyClass,
}) {
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