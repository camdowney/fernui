import React, { useEffect, useRef } from 'react'
import { cn, useField } from '@fernui/react-util'
import Error from './Error'

export interface TextAreaProps {
  innerRef?: any
  name: string
  value?: string
  onChange?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  defaultValue?: string
  readOnly?: boolean
  autoResize?: boolean
  className?: string
  label?: string
  labelClass?: string
  fieldClass?: string
  error?: string
  errorClass?: string
  [props: string]: any
}

export default function TextArea({
  innerRef,
  name,
  value: _value,
  onChange: _onChange,
  validate = () => true,
  placeholder,
  defaultValue = '',
  readOnly,
  autoResize,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please complete this field.',
  errorClass,
  ...props
}: TextAreaProps) {
  const ref = innerRef || useRef()

  const __onChange = (value: any) => {
    if (_onChange)
      _onChange(value)

    if (autoResize)
      adjustHeight(ref.current)
  }

  useEffect(() => {
    if (defaultValue && autoResize)
      adjustHeight(ref.current)
  }, [])

  const { value, disabled, showError, onChange } = useField(name, {
    defaultValue,
    value: _value,
    disabled: readOnly,
    validate,
    onChange: __onChange,
  })

  return (
    <label className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }
      <textarea
        ref={ref}
        name={name}
        value={value}
        readOnly={disabled}
        aria-label={label || placeholder || name}
        onChange={e => onChange(e.target.value)}
        className={cn('fui-textarea', fieldClass)}
        {...props}
      />
      {error && showError && <Error text={error} className={errorClass} />}
    </label>
  )
}

const adjustHeight = (element: any) => {
  const getStyle = (property: any) =>
    parseFloat(getComputedStyle(element)[property]?.replace('/\D^./g', ''))

  element.style.height = 'auto'
  element.style.height = (element.scrollHeight + getStyle('borderTopWidth') + getStyle('borderBottomWidth')) + 'px'
}