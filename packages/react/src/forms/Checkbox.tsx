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
  labelClass?: string
  defaultValue?: boolean
  className?: string
  required?: boolean
  readOnly?: boolean
  innerClass?: string
  onChange?: (e: any) => any
  message?: string | false
}

export default function Checkbox({
  innerRef,
  id,
  name,
  label,
  labelClass,
  defaultValue,
  className,
  required,
  readOnly,
  innerClass,
  onChange,
  message,
}: CheckboxProps) {
  const [invalid, setInvalid] = useState(required && !defaultValue)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<FormState>(initialState)

  const ref = innerRef || useRef()
  const showInfo = invalid && (modified || formState.error)

  const update = (e: any) => {
    setInvalid(required && !e.target.checked)
    setModified(true)
    onChange?.(e)
  }

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, { element: ref })

  useListener('FUIFieldAction', (e: any) => {
    const checked = e.detail.value
    ref.current.checked = checked
    update({ target: { checked }})
  }, { element: ref })

  return (
    <div className={cn('fui-field', showInfo && 'fui-field-invalid', className)}>
      <label style={_outerStyle}>
        <input
          type='checkbox'
          name={name || label}
          aria-label={label || name}
          defaultChecked={defaultValue}
          data-field-valid={!invalid}
          onChange={update}
          onBlur={update}
          readOnly={readOnly != null ? readOnly : formState.disabled}
          className={cn('fui-checkbox', innerClass)}
          style={_style}
          {...{ ref, id }}
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
      {message !== false && 
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