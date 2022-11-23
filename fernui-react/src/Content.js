import React from 'react'
import Cond from './Cond'
import { cn } from './_util'

export default function Content({
  id,
  className,
  as = 'h2',
  heading,
  headingClass,
  sub,
  subClass, 
  children,
  bodyClass,
  cta,
  ctaClass
}) {
  return (
    <div id={id} className={cn('fui-content', className)}>
      <Cond hide={!heading && !sub}>
        <Cond hide={!heading} as={as} className={headingClass}>
          {heading}
        </Cond>
        <Cond hide={!sub} as='p' className={cn('fui-subheading', subClass)}>
          {sub}
        </Cond>
      </Cond>
      <Cond hide={!children && !cta}>
        <Cond hide={!children} className={cn('fui-body', bodyClass)}>
          {children}
        </Cond>
        <Cond hide={!cta} className={cn('fui-cta', ctaClass)}>
          {cta}
        </Cond>
      </Cond>
    </div>
  )
}