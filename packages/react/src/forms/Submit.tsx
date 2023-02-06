import React, { useState, useRef } from 'react'
import { FormState, initialState } from './Form'
import Link, { LinkProps } from '../base/Link'
import { useListener } from '../util'

export default function Submit({ text = 'Submit', ...props }: LinkProps) {
  const [formState, setFormState] = useState<FormState>(initialState)
  const ref = useRef()

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, ref)

  return (
    <Link
      innerRef={ref}
      text={text}
      type='submit'
      disabled={formState.disabled}
      {...props}
    />
  )
}