import React, { useRef } from 'react'
import { FormState, useFormContext } from '@fernui/react-util'
import { useListener } from '@fernui/react-util'
import Button, { ButtonProps } from './Button'

export interface FormButtonProps extends ButtonProps {
  domRef?: any
  context?: FormState
  preventDefaultFocus?: boolean
}

export default function FormButton({
  domRef,
  context,
  preventDefaultFocus,
  type = 'button',
  ...props
}: FormButtonProps) {
  const { disabled } = context ?? useFormContext()
  const ref = domRef || useRef()

  useListener('mousedown', (e: any) => {
    if (preventDefaultFocus)
      e.preventDefault()
  }, { element: ref })

  return (
    <Button
      domRef={ref}
      type={type}
      disabled={disabled}
      {...props}
    />
  )
}