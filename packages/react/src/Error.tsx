import React from 'react'
import { exclamationCircleIcon } from '@fernui/icons'
import { cn } from '@fernui/util'
import Svg from './Svg'

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
      <Svg
        src={exclamationCircleIcon}
        className={cn('fui-field-error-icon', className)}
      />
      <span>{text}</span>
    </p>
  )
}