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
  value,
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

  const { values, isEditable, onChange, showError } = useField(name, {
    defaultValue,
    validate,
    value,
    onChange: __onChange,
  })

  return (
    <label className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }
      <input
        ref={ref}
        onChange={e => onChange(e.target.value)}
        value={values.get(name)}
        aria-label={label || placeholder || name}
        readOnly={readOnly ?? !isEditable}
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