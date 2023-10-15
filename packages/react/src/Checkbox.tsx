import React from 'react'
import { cn } from '@fernui/util'
import { useField } from '@fernui/react-core-util'
import { check } from './icons'
import Error from './Error'
import Icon from './Icon'

export interface CheckboxProps {
  name?: string
  value?: string
  onChange?: (e: any) => any
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

export default function Checkbox({
  name: nameProp,
  value: valueProp = 'false',
  onChange: onChangeProp,
  validate = () => true,
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
}: CheckboxProps) {
  const name = nameProp ?? label ?? ''

  const { value, disabled, showError, onChange } = useField(name, valueProp, {
    disabled: readOnly,
    validate,
    onChange: onChangeProp,
  })

  return (
    <div className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {/* Field */}
      <label style={_outerStyle}>
        <input
          type='checkbox'
          name={name}
          checked={value === 'true'}
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