import React, { useEffect } from 'react'
import { cn, useFormContext } from '@fernui/react-util'
import Error from './Error'

const useField = <T extends unknown>(
  name: string,
  options?: {
    defaultValue?: T
    value?: T
    disabled?: boolean
    validate?: (newValue: T) => boolean
    onChange?: (newValue: T) => void
  }
) => {
  const {
    defaultValue,
    value: _value,
    disabled: _disabled,
    validate,
    onChange: _onChange,
  } = options || {}

  const {
    disabled: formDisabled,
    exposed: formExposed,
    fields, setFields,
  } = useFormContext()

  const value = _value ?? (fields.get(name) ?? {}).value ?? defaultValue
  const disabled = _disabled ?? formDisabled
  const showError = (fields.get(name) ?? {}).error && ((fields.get(name) ?? {}).modified || formExposed)

  //////// CLEANUP
  console.log(name + ': ' + (fields.get(name) ?? {}).value + ' ' + defaultValue)

  const setField = (newValue: T, newModified = true) => {
    fields.set(name, {
      value: newValue,
      modified: newModified,
      error: validate ? !validate(newValue) : false
    })

    setFields(new Map(fields))
  }

  const onChange = (newValue: T) => {
    setField(newValue)
      
    if (_onChange)
      _onChange(newValue)
  }

  // Handle manual value control
  useEffect(() => {
    if (_value !== undefined) {
      onChange(_value)
    }
  }, [_value])

  // Set initial state and cleanup
  useEffect(() => {
    if (defaultValue)
      setField(defaultValue)

    return () => {
      console.log('deleting ' + name) /// CLEANUP
      fields.delete(name)
      setFields(new Map(fields))
    }
  }, [name])

  return { value, disabled, showError, setField, onChange }
}

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
  value: _value,
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
  const { value, disabled, showError, onChange } = useField(name, {
    defaultValue,
    value: _value,
    disabled: readOnly,
    validate,
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
        name={name}
        value={value}
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