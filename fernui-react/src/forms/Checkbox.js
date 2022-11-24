import React, { useState } from 'react'
import Error from './Error'
import Icon from '../Icon'
import { cn } from '../_util'
import { check } from '../_icons'

export default function Checkbox({
  fieldRef,
  id,
  name,
  label,
  className,
  required,
  formState,
  onChange,
  errorMessage
}) {
  const [invalid, setInvalid] = useState(required)
  const [modified, setModified] = useState(false)

  const update = e => {
    setInvalid(required && !e.target.checked)
    setModified(true)
  }

  const showErrors = invalid && (modified || formState < 0)

  return (
    <div className={cn('fui-field', showErrors && 'fui-field-invalid', className)}>
      <label style={wrapperStyles}>
        <input
          ref={fieldRef}
          id={id}
          type='checkbox'
          name={name || label}
          data-field-valid={!invalid}
          onChange={e => { update(e), onChange && onChange(e) }}
          onBlur={update}
          disabled={formState > 0}
          style={inputStyles}
        />
        <div className='fui-check-box' style={boxStyles}>
          <Icon i={check} className='fui-check-icon' style={iconStyles} />
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

const wrapperStyles = {
  display: 'flex',
  cursor: 'pointer',
}

const inputStyles = {
  width: '0',
  height: '0',
  outlineWidth: '0 !important',
}

const boxStyles = {
  flexShrink: '0',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const iconStyles = {
  position: 'relative',
  display: 'block',
}