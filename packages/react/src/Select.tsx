import React from 'react'
import { cn, useField } from '@fernui/react-util'
import { angle } from './icons'
import Error from './Error'
import Icon from './Icon'

export interface Option { label: string, value?: string }

export interface SelectProps {
  name: string
  value?: string
  options: Option[]
  onChange?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  placeholder?: string
  defaultValue?: string
  disabled?: boolean
  className?: string
  label?: string
  labelClass?: string
  fieldClass?: string
  error?: string
  errorClass?: string
  [props: string]: any
}

export default function Select({
  name,
  value: _value,
  options,
  onChange: _onChange,
  validate = () => true,
  placeholder,
  placeholderStyle,
  defaultValue = '',
  readOnly,
  className,
  style,
  label,
  labelClass,
  fieldClass,
  error = 'Please complete this field.',
  errorClass,
  ...props
}: SelectProps) {
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
      <div style={{ position: 'relative' }}>
        <select
          name={name}
          value={value}
          disabled={disabled}
          aria-label={label || placeholder || name}
          onChange={e => onChange(e.target.value)}
          className={cn('fui-select', fieldClass)}
          style={{ cursor: 'pointer' }}
          {...props}
        >
          {placeholder && 
            <option value=''>{placeholder}</option>
          }
          {options.map(option => 
            <option value={option.value ?? option.label} key={option.label}>
              {option.label}
            </option>    
          )}
        </select>
        <Icon
          i={angle}
          className='fui-select-icon'
          style={_iconStyle}
        />
      </div>
      {error && showError && <Error text={error} className={errorClass} />}
    </label>
  )
}

const _iconStyle = {
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
}