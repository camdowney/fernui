import React from 'react'
import { useFormContext } from '@fernui/react-util'
import Link, { LinkProps } from '../base/Link'

export default function FormButton({
  type = 'button',
  innerRef,
  to,
  ...props
}: LinkProps) {
  const { isEditable } = useFormContext()

  return (
    <Link
      type={type}
      disabled={!isEditable}
      {...props}
    />
  )
}