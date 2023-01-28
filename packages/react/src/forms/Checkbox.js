import React, { useState, useRef } from 'react'
import Info from './Info'
import Icon from '../Icon'
import { cn, useListener } from '../_util'
import { check } from '../_icons'

export default function Checkbox({
  innerRef,
  id,
  name,
  label,
  className,
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
    setInvalid(required && !e.target.checked)
    setModified(true)
  }

  useListener('FernFormStateChange', e => {
    setFormState(e.detail.state)
  }, outerRef)

  return (
    <div
      ref={outerRef}
      className={cn('fui-field', showInfo && 'fui-field-invalid', className)}
    >
      <label style={wrapperStyle}>
        <input
          ref={innerRef}
          id={id}
          type='checkbox'
          name={name || label}
          data-field-valid={!invalid}
          onChange={e => { update(e), onChange && onChange(e) }}
          onBlur={update}
          disabled={formState.disabled}
          style={inputStyle}
        />
        <div className='fui-check-box' style={boxStyle}>
          <Icon i={check} className='fui-check-icon' style={iconStyle} />
        </div>
        <Cond hide={!label} className='fui-label'>
          {label}
        </Cond>
      </label>
      <Info visible={showInfo}>
        {message || 'Please check this box to proceed.'}
      </Info>
    </div>
  )
}

const wrapperStyle = {
  display: 'flex',
  cursor: 'pointer',
}

const inputStyle = {
  width: '0',
  height: '0',
  outlineWidth: '0 !important',
}

const boxStyle = {
  flexShrink: '0',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const iconStyle = {
  position: 'relative',
  display: 'block',
}