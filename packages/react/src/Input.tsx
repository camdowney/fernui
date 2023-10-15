import React from 'react'
import { cn } from '@fernui/util'
import { useField } from '@fernui/react-core-util'
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
  info?: any
  infoClass?: string
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
  info,
  infoClass,
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
      {/* Label */}
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }

      {/* Field */}
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        readOnly={disabled}
        aria-label={label || placeholder || name}
        onChange={e => onChange(e.target.value)}
        className={cn('fui-input fui-field-block', fieldClass)}
        {...props}
      />

      {/* Error */}
      {(error && showError) && (
        <Error text={error} className={errorClass} />
      )}

      {/* Info */}
      {info && (
        <p className={cn('fui-field-info', infoClass)}>
          {info}
        </p>
      )}
    </label>
  )
}