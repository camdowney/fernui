import React from 'react'
import { useField } from '@fernui/react-util'

export default function Honeypot() {
  const name = '__config-fax-number'

  const { onChange } = useField(name, {
    validate: newValue => !newValue,
  })

  return (
    <input
      name={name}
      onChange={onChange}
      autoComplete='off'
      tabIndex={-1}
      required
      style={{ display: 'none' }}
    />
  )
}