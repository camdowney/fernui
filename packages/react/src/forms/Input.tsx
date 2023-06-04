import React, { useState, useRef, useEffect } from 'react'
import { cn, isEmail, useListener } from '@fernui/react-util'
import { FormState, initialState } from './Form'
import Info from './Info'

const adjustHeight = (element: any) => {
  const getStyle = (property: any) =>
    parseFloat(getComputedStyle(element)[property]?.replace('/\D^./g', ''))

  element.style.height = 'auto'
  element.style.height = (element.scrollHeight + getStyle('borderTopWidth') + getStyle('borderBottomWidth')) + 'px'
}

export interface InputProps {
  innerRef?: any
  id?: string
  name?: string
  label?: string
  labelClass?: string
  placeholder?: string
  defaultValue?: any
  className?: string
  type?: string
  required?: boolean
  readOnly?: boolean
  charLimit?: number
  textarea?: boolean
  autoResize?: boolean
  shiftForNewline?: boolean
  rows?: number
  cols?: number
  innerClass?: string
  onChange?: (e: any) => any
  onKeydown?: (e: any) => any
  message?: string | false
  [x:string]: any
}

export default function Input({ 
  innerRef,
  id,
  name,
  label,
  labelClass,
  placeholder,
  defaultValue,
  className,
  type = 'text',
  required,
  readOnly,
  charLimit,
  textarea,
  autoResize,
  shiftForNewline,
  rows = 0,
  cols,
  innerClass,
  onChange,
  onKeydown,
  message,
  ...props
}: InputProps) {
  const isValid = (value: string = '') =>
    required && (!value?.trim() || (type === 'email' && !isEmail(value)))

  const [invalid, setInvalid] = useState(isValid(defaultValue))
  const [modified, setModified] = useState(false)
  const [formState, setFormState] = useState<FormState>(initialState)

  const ref = innerRef || useRef()
  const showInfo = invalid && (modified || formState.error)
  
  const holdingShift = useRef(false)
  const Shell = textarea ? 'textarea' : 'input'

  const update = (e: any) => {
    setInvalid(isValid(e?.target.value))
    setModified(true)
    onChange?.(e)

    if (autoResize)
      adjustHeight(ref.current)
  }

  useEffect(() => {
    if (defaultValue && autoResize)
      adjustHeight(ref.current)
  }, [])

  useListener('FUIFormStateChange', (e: any) => {
    setFormState(e.detail.state as FormState)
  }, { element: ref })

  useListener('FUIFieldAction', (e: any) => {
    const value = e.detail.value
    ref.current.value = value
    update({ target: { value }})
  }, { element: ref })

  useListener('keydown', (e: any) => {
    if (e.keyCode === 16)
      holdingShift.current = true

    if (shiftForNewline && !holdingShift.current && e.key === 'Enter') {
      e.preventDefault()
      e.target.closest('form')?.querySelector('[type="submit"]')?.click()
    }

    onKeydown?.(e)
  }, { element: ref })

  useListener('keyup', (e: any) => {
    if (e.keyCode === 16)
      holdingShift.current = false
  }, { element: ref })

  return (
    <label className={cn('fui-field', showInfo && 'fui-field-invalid', className)}>
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }
      <Shell
        name={name || label || placeholder}
        aria-label={label || placeholder || name}
        data-field-valid={!invalid}
        onChange={update}
        onBlur={update}
        readOnly={readOnly != null ? readOnly : formState.disabled}
        maxLength={charLimit ? charLimit : textarea ? 1000 : 100}
        className={cn(textarea ? 'fui-textarea' : 'fui-input', innerClass)}
        {...{ ref, id, type, placeholder, defaultValue, rows, cols, ...props }}
      />
      {message !== false && 
        <Info visible={showInfo}>
          {message || (type === 'email' ? 'Please enter a valid email address.' : 'Please complete this field.')}
        </Info>
      }
    </label>
  )
}