import React, { useState, useRef } from 'react'
import { FormState, initialState } from './Form'
import Info from './Info'
import { cn, isEmail } from '@fernui/util'
import { useListener } from '../util'

export interface InputProps {
  innerRef?: any
  id?: string
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: any
  className?: string
  type?: string
  required?: boolean
  charLimit?: number
  onChange?: Function
  message?: string
}

export default function Input({ 
  innerRef,
  id,
  name,
  label,
  placeholder,
  defaultValue,
  className,
  type = 'text',
  required,
  charLimit,
  onChange,
  message
}: InputProps) {
  const [invalid, setInvalid] = useState(required)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<FormState>(initialState)
  const outerRef = useRef() as any
  const Shell = (type === 'area' ? 'textarea' : 'input') as any

  const showInfo = invalid && (modified || formState.error)

  const update = (e: any) => {
    setInvalid(required && (!e?.target.value || (type === 'email' && !isEmail(e.target.value))))
    setModified(true)
  }

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, outerRef)

  return (
    <label
      ref={outerRef}
      className={cn('fui-field', showInfo && 'fui-field-invalid', className)}
    >
      {label && <div className='fui-label'>{label}</div>}
      <Shell
        name={name || label || placeholder}
        data-field-valid={!invalid}
        onChange={(e: any) => { update(e), onChange?.(e) }}
        onBlur={update}
        disabled={formState.disabled}
        maxLength={charLimit ? charLimit : type === 'area' ? 1000 : 100}
        {...{ ref: innerRef, id, type, placeholder, defaultValue }}
      />
      <Info visible={showInfo}>
        {message || type === 'email' ? 'Please enter a valid email address.' : 'Please complete this field.'}
      </Info>
    </label>
  )
}