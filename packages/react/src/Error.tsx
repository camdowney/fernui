import React from 'react'
import { cn } from '@fernui/util'
import { warningIcon } from './_icons'
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
        src={warningIcon}
        className={cn('fui-field-error-icon', className)}
      />
      <span>{text}</span>
    </p>
  )
}