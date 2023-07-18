import React from 'react'
import { useField } from '@fernui/react-util'

export default function Honeypot() {
  const name = '__config-hp'

  const { onChange } = useField(name, '', {
    validate: newValue => !newValue,
  })

  return (
    <input
      name={name}
      onChange={e => onChange(e.target.value)}
      autoComplete='off'
      tabIndex={-1}
      required
      style={{ display: 'none' }}
    />
  )
}