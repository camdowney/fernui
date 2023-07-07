import React from 'react'
import { cn } from '@fernui/react-util'
import { warning } from './icons'
import Icon from './Icon'


export default function Error({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <div className='fui-field-error'>
      <Icon i={warning} className={cn('fui-field-error-icon', className)} />
      <span>{text}</span>
    </div>
  )
}