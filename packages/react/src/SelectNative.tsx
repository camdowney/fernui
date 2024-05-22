import React, { useRef } from 'react'
import { chevronIcon } from '@fernui/icons'
import { cn, oc } from '@fernui/util'
import { useField } from '@fernui/react-util'
import { FieldProps } from './_types'
import Error from './Error'
import Svg from './Svg'

export interface OptionNative { label: string, value?: string }

export interface SelectNativeProps extends FieldProps<string> {
  options: OptionNative[]
  icon?: any
  iconClass?: string
}

export default function SelectNative({
  domRef,
  context,
  name: nameProp,
  defaultValue,
  onChange,
  validate = () => true,
  placeholder,
  disabled: disabledProp,
  className,
  label,
  labelClass,
  fieldClass,
  style,
  error = 'Please complete this field.',
  errorClass,
  info,
  infoClass,
  options,
  icon,
  iconClass,
  ...props
}: SelectNativeProps) {
  const ref = domRef || useRef()

  const { name, value, setValue, disabled, showError } = useField({
    context,
    name: nameProp ?? label ?? placeholder ?? '',
    defaultValue: defaultValue ?? (placeholder ? '' : (options[0].value ?? options[0].label)),
    disabled: disabledProp,
    validate,
    onChange,
  })

  return (
    <label className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {/* Label */}
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }

      {/* Field */}
      <div style={{ position: 'relative' }}>
        <select
          ref={ref}
          name={name}
          value={value}
          disabled={disabled}
          aria-label={label || placeholder || name}
          onChange={e => setValue(e.target.value)}
          className={cn('fui-select-native fui-field-block', fieldClass)}
          style={oc(styles.field(disabled), style)}
          {...props}
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
        {icon ?? (
          <Svg
            src={chevronIcon}
            className={cn('fui-select-icon', iconClass)}
            style={styles.icon}
          />
        )}
      </div>

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
    </label>
  )
}

const styles = {
  field: (disabled: boolean) => ({
    ...!disabled && { cursor: 'pointer' },
  }),
  icon: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
}