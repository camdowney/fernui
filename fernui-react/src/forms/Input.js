import React, { useState, useRef } from 'react'
import Error from './Error'
import Cond from '../Cond'
import { cn, isEmail, useCustomListener } from '../_util'

export default function Input({ 
  fieldRef,
  id,
  name,
  label,
  placeholder,
  className,
  type = 'text',
  required,
  charLimit,
  onChange,
  errorMessage
}) {
  const [invalid, setInvalid] = useState(required)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState(0)

  const ref = useRef()

  const showErrors = invalid && (modified || formState < 0)

  const update = e => {
    setInvalid(required && (!e?.target.value || (type === 'email' && !isEmail(e.target.value))))
    setModified(true)
  }

  useCustomListener(ref, 'FernFieldAction', e => {
    setFormState(e.detail.state)
  })

  return (
    <label
      ref={ref}
      className={cn('fui-field', showErrors && 'fui-field-invalid', className)}
    >
      <Cond hide={!label} className='fui-label'>
        {label}
      </Cond>
      <Cond
        condRef={fieldRef}
        as={type === 'area' ? 'textarea' : 'input'}
        id={id}
        type={type}
        name={name || label || placeholder}
        data-field-valid={!invalid}
        placeholder={placeholder}
        onChange={e => { update(e), onChange && onChange(e) }}
        onBlur={update}
        disabled={formState > 0}
        maxLength={charLimit ? charLimit : type === 'area' ? 1000 : 100}
      />
      <Error visible={showErrors}>
        {errorMessage || type === 'email' ? 'Please enter a valid email address.' : 'Please complete this field.'}
      </Error>
    </label>
  )
}