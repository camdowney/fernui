import React from 'react'
import { useFormContext } from '@fernui/react-util'
import Link, { LinkProps } from './Link'

export default function FormButton({
  type = 'button',
  innerRef,
  to,
  ...props
}: LinkProps) {
  const { disabled } = useFormContext()

  return (
    <Link
      type={type}
      disabled={disabled}
      {...props}
    />
  )
}