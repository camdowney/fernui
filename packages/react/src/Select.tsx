import React, { useRef, useState } from 'react'
import { cn, oc } from '@fernui/util'
import { useField } from '@fernui/react-core-util'
import { angle } from './_icons'
import { FieldProps } from './_types'
import Error from './Error'
import Icon from './Icon'
import Modal from './Modal'

export interface Option { label: string, value?: string }

export interface SelectProps extends FieldProps<string> {
  options: Option[]
  icon?: any
  iconClass?: string
  modalClass?: string
  optionClass?: string
}

export default function Select({
  domRef,
  context,
  name: nameProp,
  value: valueProp,
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
  modalClass,
  optionClass,
  ...props
}: SelectProps) {
  const ref = domRef || useRef()

  const { value, setValue, disabled, showError } = useField({
    context,
    name: nameProp ?? label ?? placeholder ?? '',
    value: valueProp ?? (placeholder ? '' : (options[0].value ?? options[0].label)),
    disabled: disabledProp,
    validate,
    onChange,
  })

  const placeholderOrValue = (options.find(o => o.value === value) ?? {}).label || value || placeholder
  const placeholderAndOptions = [...placeholder ? [{ label: placeholder, value: '' }] : [], ...options]

  const [active, setActive] = useState(false)

  return (
    <label
      className={cn('fui-field', showError && 'fui-field-invalid', className)}
      style={{ position: 'relative' }}
    >
      {/* Label */}
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }

      {/* Selector */}
      <button
        ref={ref}
        type='button'
        onClick={() => setActive(curr => !curr)}
        aria-label={label || placeholder || value}
        disabled={disabled}
        className={cn('fui-select fui-field-block', fieldClass)}
        style={oc(styles.field, style)}
        {...props}
      >
        {placeholderOrValue}
        {icon ?? (
          <Icon
            i={angle}
            className={cn('fui-select-icon', iconClass)}
            style={styles.icon}
          />
        )}
      </button>

      {/* Options */}
      <Modal
        active={active}
        setActive={setActive}
        outerClass='fui-select-modal-outer'
        className={cn('fui-select-modal', modalClass)}
        style={{ top: 0 }}
      >
        {placeholderAndOptions.map(option => 
          <button
            type='button'
            onClick={() => {
              setValue(option.value ?? option.label)
              setActive(false)
            }}
            className={cn('fui-select-option', optionClass)}
            key={option.label}
          >
            {option.label}
          </button>
        )}
      </Modal>

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
  field: {
    textAlign: 'left',
  },
  icon: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
}