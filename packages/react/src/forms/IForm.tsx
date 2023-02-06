import React, { useState, useRef } from 'react'
import Form, { FormState, initialState } from './Form'
import Icon from '../base/Icon'
import Modal from '../interactive/Modal'
import { cn, openModal } from '@fernui/util'
import { warning } from '../icons'

export interface IFormProps {
  children?: any
  btn?: any
  messages?: string[]
  className?: string
  states?: FormState[]
  onStateChange?: Function
  onSubmit?: Function
  maxAttempts?: number
  maxSubmissions?: number
  [x:string]: any
}

export default function IForm({
  children,
  btn,
  messages = [],
  className,
  states,
  onStateChange,
  onSubmit,
  maxAttempts,
  maxSubmissions,
  ...props
}: IFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState)
  const modalRef = useRef()

  const message = messages[formState.id] || formState.message

  const handleState = (state: FormState) => {
    setFormState(state)

    if (state.error || state.id === 6) 
      openModal(modalRef)
  }

  return (
    <Form
      onStateChange={handleState}
      {...{ className, states, onSubmit, maxAttempts, maxSubmissions, ...props }}
    >
      {children}
      {!formState.end ? <>
        {btn}
        <Modal
          innerRef={modalRef}
          className={cn('fui-iform-modal', `fui-${formState.error ? 'error' : 'info'}-modal`)}
          bgStyle={{ display: 'none' }}
          closeDelay={2000}
          anchor
          exitOnOutsideClick={false}
          exitOnEscape={false}
          style={{ zIndex: '30 !important' }}
        >
          <Icon i={warning} className='fui-iform-icon' />
          {message}
        </Modal>
      </> : (
        <p className='fui-iform-message'>
          {message}
        </p>
      )}
    </Form>
  )
}