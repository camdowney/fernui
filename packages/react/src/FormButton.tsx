import React, { useRef } from 'react'
import { useFormContext } from '@fernui/react-core-util'
import { useListener } from '@fernui/react-util'
import Button, { ButtonProps } from './Button'

export interface FormButtonProps extends ButtonProps {
  domRef?: any
  preventDefaultFocus?: boolean
}

export default function FormButton({
  domRef,
  preventDefaultFocus,
  type = 'button',
  ...props
}: FormButtonProps) {
  const { disabled } = useFormContext()
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