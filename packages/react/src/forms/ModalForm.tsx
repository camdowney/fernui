import React, { useState, useRef } from 'react'
import Form, { FormProps, FormState, initialState } from './Form'
import Icon from '../base/Icon'
import Modal from '../interactive/Modal'
import { cn, openModal } from '@fernui/util'
import { warning } from '../icons'

export interface ModalFormProps extends FormProps {
  btn?: any
  messages?: string[]
  [x:string]: any
}

export default function ModalForm({
  btn,
  messages = [],
  children,
  onStateChange,
  ...props
}: ModalFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState)
  const modalRef = useRef()

  const message = messages[formState.id] || formState.message

  const handleState = (state: FormState) => {
    setFormState(state)

    if (state.error || (!state.end && state.id !== 0)) 
      openModal(modalRef)

    onStateChange?.(state)
  }

  return (
    <Form
      onStateChange={handleState}
      {...props}
    >
      {children}
      {formState.end ? (
        <p className='fui-mform-message'>
          {message}
        </p>
      ) : <>
        {btn}
        <Modal
          innerRef={modalRef}
          className={cn('fui-mform-modal', `fui-${formState.error ? 'error' : 'info'}-modal`)}
          bgStyle={{ display: 'none' }}
          closeDelay={2000}
          anchor
          exitOnOutsideClick={false}
          exitOnEscape={false}
        >
          <Icon i={warning} className='fui-mform-icon' />
          {message}
        </Modal>
      </>}
    </Form>
  )
}