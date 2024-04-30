import React from 'react'
import { FormState, useField } from '@fernui/react-util'

export interface HoneypotProps {
  context?: FormState
}

export default function Honeypot({ context }: HoneypotProps) {
  const { name, setValue } = useField({
    context,
    name: '__config-hp',
    defaultValue: '',
    validate: newValue => !newValue,
  })

  return (
    <input
      name={name}
      onChange={e => setValue(e.target.value)}
      autoComplete='off'
      tabIndex={-1}
      required
      style={{ display: 'none' }}
    />
  )
}