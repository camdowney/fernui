import React, { useRef } from 'react'
import { cn } from '@fernui/util'
import { useField } from '@fernui/react-util'
import { FieldProps } from './_types'
import Error from './Error'

export interface InputProps extends FieldProps<string> {}

export default function Input({
  domRef,
  context,
  name: nameProp,
  value: valueProp = '',
  onChange,
  validate = () => true,
  placeholder,
  disabled: disabledProp,
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
  const ref = domRef || useRef()

  const { name, value, setValue, disabled, showError } = useField({
    context,
    name: nameProp ?? label ?? placeholder ?? '',
    value: valueProp,
    disabled: disabledProp,
    validate,
    onChange,
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
        ref={ref}
        name={name}
        value={value}
        placeholder={placeholder}
        readOnly={disabled}
        aria-label={label || placeholder || name}
        onChange={e => setValue(e.target.value)}
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