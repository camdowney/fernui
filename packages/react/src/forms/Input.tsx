import React, { useState, useRef } from 'react'
import Info from './Info'
import { cn, isEmail } from '@fernui/util'
import { useListener } from '../util'

interface InputProps {
  innerRef?: any
  id?: string
  name?: string
  label?: string
  placeholder?: string
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
  className,
  type = 'text',
  required,
  charLimit,
  onChange,
  message
}: InputProps) {
  const [invalid, setInvalid] = useState(required)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<any>({})
  const outerRef = useRef<any>()
  const Shell = (type === 'area' ? 'textarea' : 'input') as any

  const showInfo = invalid && (modified || formState.error)

  const update = (e: any) => {
    setInvalid(required && (!e?.target.value || (type === 'email' && !isEmail(e.target.value))))
    setModified(true)
  }

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state)
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
        {...{ innerRef, id, type, placeholder }}
      />
      <Info visible={showInfo}>
        {message || type === 'email' ? 'Please enter a valid email address.' : 'Please complete this field.'}
      </Info>
    </label>
  )
}