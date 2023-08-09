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
  [props: string]: any
}

export default function TextArea({
  innerRef,
  name: _name,
  value: _value = '',
  onChange: _onChange,
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
  ...props
}: TextAreaProps) {
  const name = _name ?? label ?? placeholder ?? ''
  const ref = innerRef || useRef()

  const __onChange = (value: any) => {
    if (_onChange)
      _onChange(value)

    if (autoResize)
      adjustHeight(ref.current)
  }

  const { value, disabled, showError, onChange } = useField(name, _value, {
    disabled: readOnly,
    validate,
    onChange: __onChange,
  })

  useEffect(() => {
    if (_value && autoResize)
      adjustHeight(ref.current)
  }, [])

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
        placeholder={placeholder}
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
    parseFloat(getComputedStyle(element)[property].replace('/\D^./g', ''))

  element.style.height = 'auto'
  element.style.height = (element.scrollHeight + getStyle('borderTopWidth') + getStyle('borderBottomWidth')) + 'px'
}