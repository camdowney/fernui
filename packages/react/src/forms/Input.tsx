import React from 'react'
import { cn, useField } from '@fernui/react-util'
import Error from './Error'

export interface InputProps {
  name: string
  value?: string
  onChange?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  defaultValue?: string
  readOnly?: boolean
  className?: string
  label?: string
  labelClass?: string
  fieldClass?: string
  error?: string
  errorClass?: string
  [props: string]: any
}

export default function Input({
  name,
  value,
  onChange: _onChange,
  validate = () => true,
  placeholder,
  defaultValue = '',
  readOnly,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please complete this field.',
  errorClass,
  ...props
}: InputProps) {
  const { values, isEditable, onChange, showError } = useField(name, {
    defaultValue,
    validate,
    value,
    onChange: _onChange,
  })

  return (
    <label className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }
      <input
        onChange={e => onChange(e.target.value)}
        value={values.get(name)}
        aria-label={label || placeholder || name}
        readOnly={readOnly ?? !isEditable}
        className={cn('fui-input', fieldClass)}
        {...props}
      />
      {error && showError && <Error text={error} className={errorClass} />}
    </label>
  )
}