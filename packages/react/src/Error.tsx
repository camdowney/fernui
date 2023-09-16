import React from 'react'
import { cn } from '@fernui/react-util'
import { warning } from './icons'
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
    <div className='fui-field-error'>
      <Icon i={warning} className={cn('fui-field-error-icon', className)} />
      <span>{text}</span>
    </div>
  )
}