import React, { useState, useRef } from 'react'
import { FormState, initialState } from './Form'
import Info from './Info'
import Icon from '../base/Icon'
import { cn } from '@fernui/util'
import { useListener } from '../util'
import { angle } from '../icons'

export interface SelectProps {
  innerRef?: any
  id?: string
  name?: string
  label?: string
  hideLabel?: boolean
  placeholder?: string
  defaultValue?: any
  className?: string
  options: { label: string, value?: any }[]
  required?: boolean
  disabled?: boolean
  onChange?: (e: any) => void
  message?: string
}

export default function Select({ 
  innerRef,
  id,
  name,
  label,
  hideLabel,
  placeholder = 'Select an option',
  defaultValue,
  className,
  options,
  required,
  disabled,
  onChange,
  message,
}: SelectProps) {
  const [invalid, setInvalid] = useState(required && !defaultValue && !!placeholder)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<FormState>(initialState)

  const ref = innerRef || useRef()
  const showInfo = invalid && (modified || formState.error)

  const update = (e: any) => {
    setInvalid(required && e.target.selectedIndex < (placeholder ? 1 : 0))
    setModified(true)
    onChange?.(e)
  }

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
      <div style={{ position: 'relative' }}>
        <select
          name={name || label || placeholder}
          aria-label={label || placeholder || name}
          data-field-valid={!invalid}
          onChange={update}
          onBlur={update}
          disabled={disabled != null ? disabled : formState.disabled}
          style={{ cursor: 'pointer' }}
          {...{ ref, id, defaultValue }}
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
        <div style={_iconOuterStyle as Object}>
          <Icon i={angle} className='fui-select-icon' />
        </div>
      </div>
      {message !== '' &&
        <Info visible={showInfo}>
          {message || 'Please select an option.'}
        </Info>
      }
    </label>
  )
}

const _iconOuterStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  height: '100%',
  alignItems: 'center',
}