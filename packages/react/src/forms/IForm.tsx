import React, { useState, useRef } from 'react'
import Form from './Form'
import Icon from '../base/Icon'
import Modal from '../interactive/Modal'
import { cn, openModal } from '@fernui/util'
import { warning } from '../icons'

export interface IFormProps {
  children?: any
  btn?: any
  messages?: string[]
  [x:string]: any
}

export default function IForm({
  children,
  btn,
  messages = [],
  ...props
}: IFormProps) {
  const [formState, setFormState] = useState<any>({})
  const modalRef = useRef<any>()

  const message = messages[formState.id] || formState.message

  const handleState = (state: any) => {
    setFormState(state)

    if (state.error || state.id === 6) 
      openModal(modalRef)
  }

  return (
    <Form
      onStateChange={handleState}
      {...props}
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