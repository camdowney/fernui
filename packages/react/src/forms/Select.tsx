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
  placeholder?: string
  defaultValue?: any
  className?: string
  options: { label: string, value?: any }[]
  required?: boolean
  onChange?: (e: any) => void
  message?: string
}

export default function Select({ 
  innerRef,
  id,
  name,
  label,
  placeholder = 'Select an option',
  defaultValue,
  className,
  options,
  required,
  onChange,
  message
}: SelectProps) {
  const [invalid, setInvalid] = useState(required && !defaultValue && !!placeholder)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<FormState>(initialState)
  const ref = useRef() as any

  const showInfo = invalid && (modified || formState.error)

  const update = (e: any) => {
    setInvalid(required && e.target.selectedIndex < (placeholder ? 1 : 0))
    setModified(true)
  }

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, ref)

  return (
    <label
      ref={ref}
      className={cn('fui-field', showInfo && 'fui-field-invalid', className)}
    >
      {label && <div className='fui-label'>{label}</div>}
      <div style={{ position: 'relative' }}>
        <select
          ref={innerRef}
          id={id}
          name={name || label || placeholder}
          aria-label={label ? undefined : placeholder || name}
          defaultValue={defaultValue}
          data-field-valid={!invalid}
          onChange={e => { update(e), onChange?.(e) }}
          onBlur={update}
          disabled={formState.disabled}
          style={{ cursor: 'pointer' }}
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