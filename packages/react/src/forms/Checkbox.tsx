import React, { useState, useRef } from 'react'
import { FormState, initialState } from './Form'
import Info from './Info'
import Icon from '../base/Icon'
import { cn } from '@fernui/util'
import { useListener } from '../util'
import { check } from '../icons'

export interface CheckboxProps {
  innerRef?: any
  id?: string
  name?: string
  label?: string
  defaultValue?: boolean
  className?: string
  required?: boolean
  onChange?: (e: any) => void
  message?: string
}

export default function Checkbox({
  innerRef,
  id,
  name,
  label,
  defaultValue,
  className,
  required,
  onChange,
  message
}: CheckboxProps) {
  const [invalid, setInvalid] = useState(required && !defaultValue)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<FormState>(initialState)
  const ref = useRef() as any

  const showInfo = invalid && (modified || formState.error)

  const update = (e: any) => {
    setInvalid(required && !e.target.checked)
    setModified(true)
  }

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, ref)

  return (
    <div
      ref={ref}
      className={cn('fui-field', showInfo && 'fui-field-invalid', className)}
    >
      <label style={_outerStyle}>
        <input
          ref={innerRef}
          id={id}
          type='checkbox'
          name={name || label}
          aria-label={label ? undefined : name}
          defaultChecked={defaultValue}
          data-field-valid={!invalid}
          onChange={e => { update(e), onChange?.(e) }}
          onBlur={update}
          disabled={formState.disabled}
          style={_style}
        />
        <div className='fui-check-box' style={_iconOuterStyle}>
          <Icon i={check} className='fui-check-icon' style={_iconStyle} />
        </div>
        {label && <div className='fui-label'>{label}</div>}
      </label>
      {message !== '' && 
        <Info visible={showInfo}>
          {message || 'Please check this box to proceed.'}
        </Info>
      }
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