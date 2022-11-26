import React, { useState, useRef } from 'react'
import Error from './Error'
import Icon from '../Icon'
import Cond from '../Cond'
import { cn, useCustomListener } from '../_util'
import { angle } from '../_icons'

export default function Select({ 
  fieldRef,
  id,
  name,
  label,
  placeholder,
  className,
  options,
  required,
  onChange,
  errorMessage
}) {
  const [invalid, setInvalid] = useState(required)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState(0)
  const outerRef = useRef()

  const showErrors = invalid && (modified || formState < 0)

  const update = e => {
    setInvalid(required && e.target.selectedIndex < 1)
    setModified(true)
  }

  useCustomListener(outerRef.current, 'FernFieldAction', e => {
    setFormState(e.detail.state)
  })

  return (
    <label
      ref={outerRef}
      className={cn('fui-field', showErrors && 'fui-field-invalid', className)}
    >
      <Cond hide={!label} className='fui-label'>
        {label}
      </Cond>
      <div style={{ position: 'relative' }}>
        <select
          ref={fieldRef}
          id={id}
          name={name || label || placeholder}
          data-field-valid={!invalid}
          onChange={e => { update(e), onChange && onChange(e) }}
          onBlur={update}
          disabled={formState > 0}
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
        <div style={wrapperStyles}>
          <Icon i={angle} className='fui-dropdown-icon' />
        </div>
      </div>
      <Error visible={showErrors}>
        {errorMessage || 'Please select an option.'}
      </Error>
    </label>
  )
}

const wrapperStyles = {
  position: 'absolute',
  top: '0',
  right: '0',
  display: 'flex',
  height: '100%',
  alignItems: 'center',
}