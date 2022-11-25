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
  onSubmit,
  messages = [],
}) {
  const [formState, setFormState] = useState(0)

  const ref = useRef()
  const errorRef = useRef()

  const updateState = state => {
    setFormState(state)
    ref.current.querySelectorAll('*').forEach(e => 
      e.dispatchEvent(new CustomEvent('FernFieldAction', { detail: { state } })))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (formState === 1)
      return

    for (const field of e.target.elements) {
      if (field.hasAttribute('data-field-valid') && field.getAttribute('data-field-valid') !== 'true') {
        updateState(-1)
        errorRef.current.click()
        return
      }
    }

    updateState(2)

    onSubmit && onSubmit(e)
      .then(() => updateState(1))
      .catch(() => { updateState(-2), errorRef.current.click() })
  }

  return (
    <form
      ref={ref}
      method='post'
      onSubmit={handleSubmit}
      className={cn('fui-form', className)}
      noValidate
    >
      {children}
      {formState > 0 ? (
        <p style={{ fontStyle: 'italic' }}>
          {messages[formState] || defaultMessages[formState]}
        </p>
      ) : <>
        <Honeypot />
        <Modal
          className='fui-error-modal'
          closeDelay='2000'
          dropdown
          style={{ zIndex: '30 !important' }}
        >
          <span ref={errorRef} onClick={openModal} />
          <Icon i={warning} />
          {messages[formState] || defaultMessages[formState]}
        </Modal>
      </>}
    </form>
  )
}