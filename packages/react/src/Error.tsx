import React from 'react'
import { cn } from '@fernui/util'
import { warning } from './_icons'
import Icon from './Icon'

export interface ErrorProps {
  text: string
  className?: string
}

export default function Error({
  text,
  className,
}: ErrorProps) {
  return (
    <p className='fui-field-error'>
      <Icon i={warning} className={cn('fui-field-error-icon', className)} />
      <span>{text}</span>
    </p>
  )
}