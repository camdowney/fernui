import React, { useState, useRef } from 'react'
import Form, { FormProps, FormState, initialState } from './Form'
import Icon from '../base/Icon'
import Dropdown from '../interactive/Dropdown'
import { cn, openUI } from '@fernui/util'
import { warning } from '../icons'

export interface InfoFormProps extends FormProps {
  btn?: any
  messages?: string[]
  [x:string]: any
}

export default function InfoForm({
  btn,
  messages = [],
  children,
  onStateChange: _onStateChange,
  ...props
}: InfoFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState)
  const dropdownRef = useRef()

  const message = messages[formState.id] || formState.message

  const onStateChange = (state: FormState) => {
    setFormState(state)

    if (state.error || (!state.end && state.id !== 0)) 
      openUI(dropdownRef)

    _onStateChange?.(state)
  }

  return (
    <Form
      onStateChange={onStateChange}
      {...props}
    >
      {children}
      {formState.end ? (
        <p className='fui-info-form-message'>
          {message}
        </p>
      ) : <>
        {btn}
        <Dropdown
          innerRef={dropdownRef}
          className={cn('fui-form-info', formState.error && 'fui-form-info-error')}
          closeDelay={2000}
          exitOnOutsideClick={false}
          exitOnEscape={false}
        >
          <Icon i={warning} className='fui-form-info-icon' />
          <span>{message}</span>
        </Dropdown>
      </>}
    </Form>
  )
}