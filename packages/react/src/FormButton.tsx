import React, { useRef } from 'react'
import { useFormContext } from '@fernui/react-core-util'
import { useListener } from '@fernui/react-util'
import Button, { ButtonProps } from './Button'

export interface FormButtonProps extends ButtonProps {
  innerRef?: any
  preventDefaultFocus?: boolean
}

export default function FormButton({
  innerRef,
  preventDefaultFocus,
  type = 'button',
  ...props
}: FormButtonProps) {
  const { disabled } = useFormContext()
  const ref = innerRef || useRef()

  useListener('mousedown', (e: any) => {
    if (preventDefaultFocus)
      e.preventDefault()
  }, { element: ref })

  return (
    <Button
      innerRef={ref}
      type={type}
      disabled={disabled}
      {...props}
    />
  )
}