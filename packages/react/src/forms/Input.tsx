import React, { useState, useRef, useEffect } from 'react'
import { FormState, initialState } from './Form'
import Info from './Info'
import { cn, isEmail } from '@fernui/util'
import { useListener } from '../util'

const adjustHeight = (element: any) => {
  const getStyle = (property: any) =>
    parseFloat(getComputedStyle(element)[property]?.replace('/\D^./g', ''))

  element.style.height = 'auto'
  element.style.height = (element.scrollHeight + getStyle('borderTopWidth') + getStyle('borderBottomWidth')) + 'px'
}

export interface InputProps {
  innerRef?: any
  id?: string
  name?: string
  label?: string
  hideLabel?: boolean
  placeholder?: string
  defaultValue?: any
  className?: string
  type?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  charLimit?: number
  textarea?: boolean
  autoResize?: boolean
  rows?: number
  cols?: number
  innerClass?: string
  onChange?: (e: any) => void
  message?: string
}

export default function Input({ 
  innerRef,
  id,
  name,
  label,
  hideLabel,
  placeholder,
  defaultValue,
  className,
  type = 'text',
  required,
  disabled,
  readOnly,
  charLimit,
  textarea,
  autoResize,
  rows = 0,
  cols,
  innerClass,
  onChange,
  message,
}: InputProps) {
  const [invalid, setInvalid] = useState(required && (!defaultValue || (type === 'email' && !isEmail(defaultValue))))
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<FormState>(initialState)

  const ref = innerRef || useRef()
  const Shell = textarea ? 'textarea' : 'input'
  const showInfo = invalid && (modified || formState.error)

  const update = (e: any) => {
    setInvalid(required && (!e?.target.value || (type === 'email' && !isEmail(e.target.value))))
    setModified(true)
    onChange?.(e)

    if (autoResize)
      adjustHeight(ref.current)
  }

  useEffect(() => {
    if (defaultValue && autoResize)
      adjustHeight(ref.current)
  }, [])

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, ref)

  useListener('FUIFieldAction', (e: any) => {
    const value = e.detail.value
    ref.current.value = value
    update({ target: { value }})
  }, ref)

  return (
    <label className={cn('fui-field', showInfo && 'fui-field-invalid', className)}>
      {(!hideLabel && label) && 
        <div className='fui-label'>{label}</div>
      }
      <Shell
        name={name || label || placeholder}
        aria-label={label || placeholder || name}
        data-field-valid={!invalid}
        onChange={update}
        onBlur={update}
        disabled={disabled != null ? disabled : formState.disabled}
        readOnly={readOnly != null ? readOnly : formState.disabled}
        maxLength={charLimit ? charLimit : textarea ? 1000 : 100}
        className={innerClass}
        {...{ ref, id, type, placeholder, defaultValue, rows, cols }}
      />
      {message !== '' && 
        <Info visible={showInfo}>
          {message || (type === 'email' ? 'Please enter a valid email address.' : 'Please complete this field.')}
        </Info>
      }
    </label>
  )
}