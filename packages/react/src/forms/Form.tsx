import React, { useRef } from 'react'
import Honeypot from './Honeypot'
import { cn } from '../util'

const defaultStates = [
  { id: 0, end: 0, error: 0, disabled: 0, message: 'Default state'                          },
  { id: 1, end: 0, error: 0, disabled: 1, message: 'Submitting...'                          },
  { id: 2, end: 0, error: 1, disabled: 0, message: 'Please correct the highlighted fields.' },
  { id: 3, end: 1, error: 1, disabled: 1, message: 'Maximum number of attempts reached.'    },
  { id: 4, end: 0, error: 1, disabled: 0, message: 'Server error; please retry shortly.'    },
  { id: 5, end: 1, error: 0, disabled: 1, message: 'Successfully submitted. Thank you!'     },
  { id: 6, end: 0, error: 0, disabled: 0, message: 'Successfully saved!'                    },
]

interface FormProps {
  className?: string
  children?: any
  states?: Object[]
  onStateChange?: Function
  onSubmit?: Function
  maxAttempts?: number
  maxSubmissions?: number
  [x:string]: any
}

export default function Form({
  className,
  children,
  states = defaultStates,
  onStateChange,
  onSubmit,
  maxAttempts = 99,
  maxSubmissions = 1,
  ...props
}: FormProps) {
  const attempts = useRef(0)
  const submissions = useRef(0)
  const formRef = useRef<any>()

  const updateState = (newState: number) => {
    const state = states[newState]

    formRef.current.querySelectorAll('*').forEach((element: HTMLElement) => {
      element.dispatchEvent(new CustomEvent('FUIFormStateChange', { detail: { state } }))
    })
    
    onStateChange && onStateChange(state)
  }

  const handleSubmit = async (e: any) => {
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
      {...props}
    >
      <Honeypot />
      {children}
    </form>
  )
}