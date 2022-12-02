import React, { useState, useRef } from 'react'
import Honeypot from './Honeypot'
import Modal from '../Modal'
import Icon from '../Icon'
import { cn, openModal } from '../_util'
import { warning } from '../_icons'

const defaultMessages = {
  '2': 'Submitting...',
  '1': 'Successfully submitted. Thank you!',
  '0': '',
  '-1': 'Please correct the highlighted fields.',
  '-2': 'Server error; please retry shortly.',
}

export default function Form({
  className,
  children,
  btn,
  onSubmit,
  messages = [],
  maxAttempts = 99,
  maxSubmissions = 1,
}) {
  const [formState, setFormState] = useState(0)

  const attempts = useRef(0)
  const submissions = useRef(0)

  const formRef = useRef()
  const errorRef = useRef()

  const updateState = state => {
    setFormState(state)

    formRef.current.querySelectorAll('*').forEach(element => {
      element.dispatchEvent(new CustomEvent('FernFieldAction', { detail: { state } }))
    })
    
    if (state < 0) 
      openModal(errorRef)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (attempts.current++ >= maxAttempts || submissions.current >= maxSubmissions)
      return

    for (const field of e.target.elements) {
      if (field.hasAttribute('data-field-valid') && field.getAttribute('data-field-valid') !== 'true')
        return updateState(-1)
    }

    updateState(2)

    onSubmit && onSubmit(e)
      .then(() => updateState(++submissions.current >= maxSubmissions ? 1 : 0))
      .catch(() => updateState(-2))
  }

  return (
    <form
      ref={formRef}
      method='post'
      onSubmit={handleSubmit}
      className={cn('fui-form', className)}
      noValidate
    >
      {children}
      <Honeypot />
      {formState > 0 ? (
        <p style={{ fontStyle: 'italic' }}>
          {messages[formState] || defaultMessages[formState]}
        </p>
      ) : <>
        {btn}
        {messages !== false &&
          <Modal
            innerRef={errorRef}
            className='fui-error-modal'
            closeDelay='2000'
            dropdown
            style={{ zIndex: '30 !important' }}
          >
            <Icon i={warning} />
            {messages[formState] || defaultMessages[formState]}
          </Modal>
        }
      </>}
    </form>
  )
}