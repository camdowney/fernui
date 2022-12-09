import React, { useState, useRef } from 'react'
import Form from './Form'
import Modal from '../Modal'
import Icon from '../Icon'
import { cn, openModal } from '../_util'
import { warning } from '../_icons'

export default function InteractForm({
  children,
  btn,
  messages = [],
  ...props
}) {
  const [formState, setFormState] = useState({})
  const modalRef = useRef()

  const message = messages[formState.id] || formState.message

  const handleState = state => {
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
      {formState.end ? (
        <p style={{ fontStyle: 'italic' }}>
          {message}
        </p>
      ) : <>
        {btn}
        <Modal
          innerRef={modalRef}
          className={cn('fui-interact-modal', `fui-${formState.error ? 'error' : 'info'}-modal`)}
          bgClass='hidden'
          closeDelay='2000'
          relative
          exitOn={false}
          style={{ zIndex: '30 !important' }}
        >
          <Icon i={warning} />
          {message}
        </Modal>
      </>}
    </Form>
  )
}