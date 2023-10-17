import React from 'react'
import { useField } from '@fernui/react-core-util'

export default function Honeypot() {
  const { name, setValue } = useField({
    name: '__config-hp',
    value: '',
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