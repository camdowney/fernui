import React, { useState, useRef } from 'react'
import Honeypot from './Honeypot'
import Link from '../Link'
import Modal from '../Modal'
import Cond from '../Cond'
import Icon from '../Icon'
import { openModal } from '../_util'
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
  btn = { text: 'Submit' }
}) {
  const [formState, setFormState] = useState(0)
  const errorRef = useRef()

  const handleSubmit = async e => {
    e.preventDefault()

    if (formState === 1)
      return

    for (const field of e.target.elements) {
      if (field.hasAttribute('data-field-valid') && field.getAttribute('data-field-valid') !== 'true') {
        setFormState(-1)
        errorRef.current.click()
        return
      }
    }

    setFormState(2)

    onSubmit && onSubmit(e)
      .then(() => setFormState(1))
      .catch(() => { setFormState(-2), errorRef.current.click() })
  }

  return (
    <form
      method='post'
      onSubmit={handleSubmit}
      className='fui-form'
      noValidate
    >
      <Cond
        className={className}
        children={children}
        formState={formState}
      />
      {formState > 0 ? (
        <p style={{ fontStyle: 'italic' }}>
          {messages[formState] || defaultMessages[formState]}
        </p>
      ) : <>
        <Honeypot />
        <Link disabled={formState > 0} {...btn} />
        <Modal
          className='fui-error-modal'
          closeDelay='2000'
          relative
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