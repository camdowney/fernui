import React, { useState, useRef } from 'react'
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
  className?: string
  options: string[]
  required?: boolean
  onChange?: Function
  message?: string
}

export default function Select({ 
  innerRef,
  id,
  name,
  label,
  placeholder,
  className,
  options,
  required,
  onChange,
  message
}: SelectProps) {
  const [invalid, setInvalid] = useState(required)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<any>({})
  const outerRef = useRef<any>()

  const showInfo = invalid && (modified || formState.error)

  const update = (e: any) => {
    setInvalid(required && e.target.selectedIndex < 1)
    setModified(true)
  }

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state)
  }, outerRef)

  return (
    <label
      ref={outerRef}
      className={cn('fui-field', showInfo && 'fui-field-invalid', className)}
    >
      {label && <div className='fui-label'>{label}</div>}
      <div style={{ position: 'relative' }}>
        <select
          ref={innerRef}
          id={id}
          name={name || label || placeholder}
          data-field-valid={!invalid}
          onChange={e => { update(e), onChange?.(e) }}
          onBlur={update}
          disabled={formState.disabled}
          style={{ cursor: 'pointer' }}
        >
          <option>
            {placeholder || 'Select an option'}
          </option>
          {options.map(o => 
            <option value={o} key={o}>
              {o}
            </option>    
          )}
        </select>
        <div style={wrapperStyle as Object}>
          <Icon i={angle} className='fui-select-icon' />
        </div>
      </div>
      <Info visible={showInfo}>
        {message || 'Please select an option.'}
      </Info>
    </label>
  )
}

const wrapperStyle: any = {
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  height: '100%',
  alignItems: 'center',
}