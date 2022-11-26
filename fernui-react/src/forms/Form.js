import React, { useState, useRef } from 'react'
import Honeypot from './Honeypot'
import Cond from '../Cond'
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
  maxAttempts = Infinity,
  maxSubmissions = Infinity,
}) {
  const [formState, setFormState] = useState(0)

  const attempts = useRef(0)
  const submissions = useRef(0)

  const formRef = useRef()
  const errorRef = useRef()

  const updateState = state => {
    setFormState(state)
    formRef.current.querySelectorAll('*').forEach(e => {
      e.dispatchEvent(new CustomEvent('FernFieldAction', { detail: { state } }))
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (attempts >= maxAttempts || submissions >= maxSubmissions)
      return

    attempts.current++

    for (const field of e.target.elements) {
      if (field.hasAttribute('data-field-valid') && field.getAttribute('data-field-valid') !== 'true') {
        updateState(-1)
        errorRef.current.click()
        return
      }
    }

    updateState(2)

    onSubmit && onSubmit(e)
      .then(() => {
        updateState(++submissions.current >= maxSubmissions ? 1 : 0)
      })
      .catch(() => {
        updateState(-2)
        errorRef.current.click()
      })
  }

  return (
   <div />
  )
}