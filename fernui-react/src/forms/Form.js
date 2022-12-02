import React, { useRef } from 'react'
import Honeypot from './Honeypot'
import { cn } from '../_util'

const defaultStates = [
  { id: 0, end: false, error: false, disabled: false, message: 'Default state'                          },
  { id: 1, end: false, error: false, disabled: true,  message: 'Submitting...'                          },
  { id: 2, end: false, error: true,  disabled: false, message: 'Please correct the highlighted fields.' },
  { id: 3, end: true,  error: true,  disabled: true,  message: 'Maximum number of attempts reached.'    },
  { id: 4, end: false, error: true,  disabled: false, message: 'Server error; please retry shortly.'    },
  { id: 5, end: true,  error: false, disabled: true,  message: 'Successfully submitted. Thank you!'     },
  { id: 6, end: false, error: false, disabled: false, message: 'Successfully saved!'                    },
]

export default function Form({
  className,
  children,
  states = [],
  onStateChange,
  onSubmit,
  maxAttempts = 99,
  maxSubmissions = 1,
}) {
  const attempts = useRef(0)
  const submissions = useRef(0)
  const formRef = useRef()

  const updateState = newState => {
    const state = states[newState] || defaultStates[newState]

    formRef.current.querySelectorAll('*').forEach(element => {
      element.dispatchEvent(new CustomEvent('FernFormAction', { detail: { state } }))
    })
    
    onStateChange && onStateChange(state)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (attempts.current++ >= maxAttempts)
      return updateState(3)

    for (const field of e.target.elements) {
      if (field.hasAttribute('data-field-valid') && field.getAttribute('data-field-valid') !== 'true')
        return updateState(2)
    }

    updateState(1)

    onSubmit && onSubmit(e)
      .then(() => updateState(++submissions.current >= maxSubmissions ? 5 : 6))
      .catch(() => updateState(4))
  }

  return (
    <form
      ref={formRef}
      method='post'
      onSubmit={handleSubmit}
      className={cn('fui-form', className)}
      noValidate
    >
      <Honeypot />
      {children}
    </form>
  )
}