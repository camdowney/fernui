import React, { useRef } from 'react'
import { checkmarkIcon } from '@fernui/icons'
import { cn } from '@fernui/util'
import { useField } from '@fernui/react-util'
import { FieldProps } from './_types'
import Error from './Error'
import Icon from './Icon'

export interface CheckboxProps extends FieldProps<string> {}

export default function Checkbox({
  context,
  domRef,
  name: nameProp,
  defaultValue = 'false',
  onChange,
  validate = () => true,
  disabled: disabledProp,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please complete this field.',
  errorClass,
  info,
  infoClass,
  ...props
}: CheckboxProps) {
  const ref = domRef || useRef()

  const { name, value, setValue, disabled, showError } = useField({
    context,
    name: nameProp ?? label ?? '',
    defaultValue,
    disabled: disabledProp,
    validate,
    onChange,
  })

  return (
    <div className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {/* Field */}
      <label style={styles.outer}>
        <input
          ref={ref}
          type='checkbox'
          name={name}
          checked={value === 'true'}
          readOnly={disabled}
          aria-label={label || name}
          onChange={e => setValue(e.target.value)}
          className={cn('fui-checkbox', fieldClass)}
          style={styles.field}
          {...props}
        />
        <div className='fui-check-box' style={styles.iconOuter}>
          <Icon data={checkmarkIcon} className='fui-check-icon' style={styles.icon} />
        </div>
        {label &&
          <div className={cn('fui-field-label', labelClass)}>
            {label}
          </div>
        }
      </label>

      {/* Error */}
      {(error && showError) && (
        <Error text={error} className={errorClass} />
      )}

      {/* Info */}
      {info && (
        <p className={cn('fui-field-info', infoClass)}>
          {info}
        </p>
      )}
    </div>
  )
}

const styles = {
  outer: {
    display: 'flex',
    cursor: 'pointer',
  },
  field: {
    width: 0,
    height: 0,
    outlineWidth: '0 !important',
  },
  iconOuter: {
    flexShrink: 0,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'relative',
    display: 'block',
  },
}