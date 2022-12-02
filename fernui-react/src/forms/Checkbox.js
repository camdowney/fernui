import React, { useState, useRef } from 'react'
import Error from './Error'
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
  errorMessage
}) {
  const [invalid, setInvalid] = useState(required)
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState(0)
  const outerRef = useRef()

  const showErrors = invalid && (modified || formState < 0)

  const update = e => {
    setInvalid(required && !e.target.checked)
    setModified(true)
  }

  useListener('FernFieldAction', e => {
    setFormState(e.detail.state)
  }, outerRef)

  return (
    <div
      ref={outerRef}
      className={cn('fui-field', showErrors && 'fui-field-invalid', className)}
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
          disabled={formState > 0}
          style={inputStyle}
        />
        <div className='fui-check-box' style={boxStyle}>
          <Icon i={check} className='fui-check-icon' style={iconStyle} />
        </div>
        <Cond hide={!label} className='fui-label'>
          {label}
        </Cond>
      </label>
      <Error visible={showErrors}>
        {errorMessage || 'Please check this box to proceed.'}
      </Error>
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