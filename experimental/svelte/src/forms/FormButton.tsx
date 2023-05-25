import React, { useState, useRef } from 'react'
import { FormState, initialState } from './Form'
import Link, { LinkProps } from '../base/Link'
import { useListener } from '../util'

export default function FormButton({
  type = 'button',
  innerRef,
  to,
  ...props
}: LinkProps) {
  const [formState, setFormState] = useState<FormState>(initialState)
  const ref = innerRef || useRef()

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, { element: ref })

  return (
    <Link
      innerRef={ref}
      type={type}
      disabled={formState.disabled}
      {...props}
    />
  )
}