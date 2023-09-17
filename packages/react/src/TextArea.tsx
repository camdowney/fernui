import React, { useEffect, useRef } from 'react'
import { cn, useField } from '@fernui/react-util'
import Error from './Error'

export interface TextAreaProps {
  innerRef?: any
  name?: string
  value?: string
  onChange?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  readOnly?: boolean
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
  innerRef,
  name: nameProp,
  value: valueProp = '',
  onChange: onChangeProp,
  validate = () => true,
  placeholder,
  readOnly,
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
  const name = nameProp ?? label ?? placeholder ?? ''
  const ref = innerRef || useRef()

  const onChangeAndResize = (value: any) => {
    if (onChangeProp)
      onChangeProp(value)

    if (autoResize)
      adjustHeight(ref.current)
  }

  const { value, disabled, showError, onChange } = useField(name, valueProp, {
    disabled: readOnly,
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
        onChange={e => onChange(e.target.value)}
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