import React, { useState, useRef } from 'react'
import Form from './Form'
import Icon from '../base/Icon'
import Modal from '../interactive/Modal'
import { cn, openModal } from '../util'
import { warning } from '../icons'

interface InteractFormProps {
  children?: any
  btn?: any
  messages?: string[]
  [x:string]: any
}

export default function InteractForm({
  children,
  btn,
  messages = [],
  ...props
}: InteractFormProps) {
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
          className={cn('fui-interact-modal', `fui-${formState.error ? 'error' : 'info'}-modal`)}
          bgClass='hidden'
          closeDelay={2000}
          relative
          exitOn={{}}
          style={{ zIndex: '30 !important' }}
        >
          <Icon i={warning} className='fui-interact-icon' />
          {message}
        </Modal>
        
      </> : (
        <p className='fui-interact-message'>
          {message}
        </p>
      )}
    </Form>
  )
}