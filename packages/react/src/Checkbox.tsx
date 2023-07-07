import React from 'react'
import { cn, useField } from '@fernui/react-util'
import { check } from './icons'
import Error from './Error'
import Icon from './Icon'

export interface CheckboxProps {
  name: string
  value?: string
  onChange?: (e: any) => any
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

export default function Checkbox({
  name,
  value: _value,
  onChange: _onChange,
  validate = () => true,
  defaultValue = 'false',
  readOnly,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please complete this field.',
  errorClass,
  ...props
}: CheckboxProps) {
  const { value, disabled, showError, onChange } = useField(name, {
    defaultValue,
    value: _value,
    disabled: readOnly,
    validate,
    onChange: _onChange,
  })

  return (
    <div className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      <label style={_outerStyle}>
        <input
          type='checkbox'
          name={name}
          checked={value}
          readOnly={disabled}
          aria-label={label || name}
          onChange={e => onChange(e.target.value)}
          className={cn('fui-checkbox', fieldClass)}
          style={_style}
          {...props}
        />
        <div className='fui-check-box' style={_iconOuterStyle}>
          <Icon i={check} className='fui-check-icon' style={_iconStyle} />
        </div>
        {label &&
          <div className={cn('fui-field-label', labelClass)}>
            {label}
          </div>
        }
      </label>
      {error && showError && <Error text={error} className={errorClass} />}
    </div>
  )
}

const _outerStyle = {
  display: 'flex',
  cursor: 'pointer',
}

const _style = {
  width: 0,
  height: 0,
  outlineWidth: '0 !important',
}

const _iconOuterStyle = {
  flexShrink: 0,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const _iconStyle = {
  position: 'relative',
  display: 'block',
}