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
  labelClass?: string
  placeholder?: string | false
  defaultValue?: any
  className?: string
  options: { label: string, value?: any }[]
  required?: boolean
  readOnly?: boolean
  innerClass?: string
  onChange?: (e: any) => any
  message?: string | false
}

export default function Select({ 
  innerRef,
  id,
  name,
  label,
  labelClass,
  placeholder = 'Select an option',
  defaultValue,
  className,
  options,
  required,
  readOnly,
  innerClass,
  onChange,
  message,
}: SelectProps) {
  const [invalid, setInvalid] = useState(required && !defaultValue && !!placeholder)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<FormState>(initialState)

  const ref = innerRef || useRef()
  const showInfo = invalid && (modified || formState.error)

  const disabled = readOnly != null ? readOnly : formState.disabled

  const update = (e: any) => {
    setInvalid(required && e.target.selectedIndex < (placeholder ? 1 : 0))
    setModified(true)
    onChange?.(e)
  }

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, { element: ref })

  useListener('FUIFieldAction', (e: any) => {
    const value = e.detail.value
    ref.current.value = value
    update({ target: { value }})
  }, { element: ref })

  return (
    <label className={cn('fui-field', showInfo && 'fui-field-invalid', className)}>
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }
      <div style={{ position: 'relative' }}>
        <select
          name={name || label || placeholder || ''}
          aria-label={label || placeholder || name}
          data-field-valid={!invalid}
          onChange={update}
          onBlur={update}
          disabled={disabled}
          className={cn('fui-select', innerClass)}
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
        <Icon
          i={angle}
          className='fui-select-icon'
          style={_iconStyle}
        />
      </div>
      {message !== false &&
        <Info visible={showInfo}>
          {message || 'Please select an option.'}
        </Info>
      }
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