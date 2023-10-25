import React, { useEffect, useRef } from 'react'
import { cn } from '@fernui/util'
import { useField } from '@fernui/react-core-util'
import Error from './Error'

export interface TextAreaProps {
  domRef?: any
  name?: string
  value?: string
  onChange?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  disabled?: boolean
  autoResize?: boolean
  className?: string
  label?: string
  labelClass?: string
  fieldClass?: string
  error?: string
  errorClass?: string
  info?: any
  infoClass?: string
  [props: string]: any
}

export default function TextArea({
  domRef,
  name: nameProp,
  value: valueProp = '',
  onChange,
  validate = () => true,
  placeholder,
  disabled: disabledProp,
  autoResize,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please complete this field.',
  errorClass,
  info,
  infoClass,
  ...props
}: TextAreaProps) {
  const ref = domRef || useRef()

  const onChangeAndResize = (value: any) => {
    if (onChange) onChange(value)
    if (autoResize) adjustHeight(ref.current)
  }

  const { name, value, setValue, disabled, showError } = useField({
    name: nameProp ?? label ?? placeholder ?? '',
    value: valueProp,
    disabled: disabledProp,
    validate,
    onChange: onChangeAndResize,
  })

  useEffect(() => {
    if (valueProp && autoResize)
      adjustHeight(ref.current)
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
        className={cn('fui-textarea fui-field-block', fieldClass)}
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