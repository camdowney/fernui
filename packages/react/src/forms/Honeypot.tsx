import React, { useState } from 'react'
import { useField } from '@fernui/react-util'

export default function Honeypot() {
  const [isValid, setIsValid] = useState(true)

  const name = '__config-fax'

  const { values, onChange, isEditable } = useField


  return (
    <input
      name='__config-fax'
      type='checkbox'
      value={1}
      onChange={e => setIsValid(!e.target.checked)}
      data-field-valid={isValid}
      autoComplete='off'
      tabIndex={-1}
      required
      style={{ display: 'none' }}
    />
  )
}