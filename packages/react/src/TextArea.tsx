import React, { useEffect, useRef } from 'react'
import { cn } from '@fernui/util'
import { useField } from '@fernui/react-util'
import { FieldProps } from './_types'
import Error from './Error'

export interface TextAreaProps extends FieldProps<string> {
  autoResize?: boolean
}

export default function TextArea({
  domRef,
  context,
  name: nameProp,
  defaultValue = '',
  onChange,
  validate = () => true,
  placeholder,
  disabled: disabledProp,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please complete this field.',
  errorClass,
  info,
  infoClass,
  autoResize,
  ...props
}: TextAreaProps) {
  const ref = domRef || useRef()

  const { name, value, setValue, disabled, showError } = useField({
    context,
    name: nameProp ?? label ?? placeholder ?? '',
    defaultValue,
    disabled: disabledProp,
    validate,
    onChange: value => {
      if (onChange) onChange(value)
      if (autoResize) adjustHeight(ref.current)
    },
  })

  useEffect(() => {
    if (defaultValue && autoResize) adjustHeight(ref.current)
  }, [])

  return (
    <label className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {/* Label */}
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }

      {/* Field */}
      <textarea
        ref={ref}
        name={name}
        value={value}
        placeholder={placeholder}
        readOnly={disabled}
        aria-label={label || placeholder || name}
        onChange={e => setValue(e.target.value)}
        className={cn('fui-textarea fui-field-block', autoResize && 'fui-textarea-auto-resize', fieldClass)}
        {...props}
      />

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

const adjustHeight = (element: any) => {
  const getStyle = (property: any) =>
    parseFloat(getComputedStyle(element)[property].replace('/\D^./g', ''))

  element.style.height = 'auto'
  element.style.height = (element.scrollHeight + getStyle('borderTopWidth') + getStyle('borderBottomWidth')) + 'px'
}