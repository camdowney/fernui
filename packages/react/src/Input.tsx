import React from 'react'
import { cn, useField } from '@fernui/react-util'
import Error from './Error'

export interface InputProps {
  name?: string
  value?: string
  onChange?: (newValue: string) => void
  validate?: (newValue: string) => boolean
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
  name: nameProp,
  value: valueProp = '',
  onChange: onChangeProp,
  validate = () => true,
  placeholder,
  readOnly,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please complete this field.',
  errorClass,
  ...props
}: InputProps) {
  const name = nameProp ?? label ?? placeholder ?? ''

  const { value, disabled, showError, onChange } = useField(name, valueProp, {
    disabled: readOnly,
    validate,
    onChange: onChangeProp,
  })

  return (
    <label className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        readOnly={disabled}
        aria-label={label || placeholder || name}
        onChange={e => onChange(e.target.value)}
        className={cn('fui-input', fieldClass)}
        {...props}
      />
      {error && showError && <Error text={error} className={errorClass} />}
    </label>
  )
}