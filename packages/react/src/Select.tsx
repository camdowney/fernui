import React from 'react'
import { cn, useField } from '@fernui/react-util'
import { angle } from './icons'
import Error from './Error'
import Icon from './Icon'

export interface Option { label: string, value?: string }

export interface SelectProps {
  name?: string
  value?: string
  options: Option[]
  onChange?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  placeholder?: string
  readOnly?: boolean
  className?: string
  label?: string
  labelClass?: string
  fieldClass?: string
  style?: Object
  error?: string
  errorClass?: string
  [props: string]: any
}

export default function Select({
  name: nameProp,
  value: valueProp,
  options,
  onChange: onChangeProp,
  validate = () => true,
  placeholder,
  readOnly,
  className,
  label,
  labelClass,
  fieldClass,
  style,
  error = 'Please complete this field.',
  errorClass,
  ...props
}: SelectProps) {
  const name = nameProp ?? label ?? placeholder ?? ''
  const selectedValue = valueProp ?? (placeholder ? '' : (options[0].value ?? options[0].label))

  const { value, disabled, showError, onChange } = useField(name, selectedValue, {
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
      <div style={{ position: 'relative' }}>
        <select
          name={name}
          value={value}
          disabled={disabled}
          aria-label={label || placeholder || name}
          onChange={e => onChange(e.target.value)}
          className={cn('fui-select', fieldClass)}
          style={{ ..._style(disabled), ...style }}
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

const _style = (disabled: boolean) => ({
  ...(!disabled && { cursor: 'pointer' })
})

const _iconStyle = {
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
}