import React, { useState, useRef } from 'react'
import Info from './Info'
import Icon from '../Icon'
import Cond from '../Cond'
import { cn, useListener } from '../_util'
import { angle } from '../_icons'

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
}) {
  const [invalid, setInvalid] = useState(required)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState({})
  const outerRef = useRef()

  const showInfo = invalid && (modified || formState.error)

  const update = e => {
    setInvalid(required && e.target.selectedIndex < 1)
    setModified(true)
  }

  useListener('FernFormAction', e => {
    setFormState(e.detail.state)
  }, outerRef)

  return (
    <label
      ref={outerRef}
      className={cn('fui-field', showInfo && 'fui-field-invalid', className)}
    >
      <Cond hide={!label} className='fui-label'>
        {label}
      </Cond>
      <div style={{ position: 'relative' }}>
        <select
          ref={innerRef}
          id={id}
          name={name || label || placeholder}
          data-field-valid={!invalid}
          onChange={e => { update(e), onChange && onChange(e) }}
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
        <div style={wrapperStyle}>
          <Icon i={angle} className='fui-dropdown-icon' />
        </div>
      </div>
      <Info visible={showInfo}>
        {message || 'Please select an option.'}
      </Info>
    </label>
  )
}

const wrapperStyle = {
  position: 'absolute',
  top: '0',
  right: '0',
  display: 'flex',
  height: '100%',
  alignItems: 'center',
}