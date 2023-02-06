import React, { useRef } from 'react'
import Honeypot from './Honeypot'
import { cn } from '@fernui/util'

export type FormState = {
  id: number
  end: boolean
  error: boolean
  disabled: boolean
  message: string
}

export const initialState: FormState = { id: 0, end: false, error: false, disabled: false, message: 'Initial state' }

const defaultStates: FormState[] = [
  initialState,
  { id: 1, end: false, error: false, disabled: true,  message: 'Submitting...'                          },
  { id: 2, end: false, error: true,  disabled: false, message: 'Please correct the highlighted fields.' },
  { id: 3, end: true,  error: true,  disabled: true,  message: 'Maximum number of attempts reached.'    },
  { id: 4, end: false, error: true,  disabled: false, message: 'Server error; please retry shortly.'    },
  { id: 5, end: true,  error: false, disabled: true,  message: 'Successfully submitted. Thank you!'     },
  { id: 6, end: false, error: false, disabled: false, message: 'Successfully saved!'                    },
]

export interface FormProps {
  className?: string
  children?: any
  states?: FormState[]
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
  const formRef = useRef() as any

  const updateState = (newState: number) => {
    const state = states[newState]

    formRef.current.querySelectorAll('*').forEach((element: HTMLElement) => {
      element.dispatchEvent(new CustomEvent('FUIFormStateChange', { detail: { state } }))
    })
    
    onStateChange?.(state)
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

    if (!onSubmit)
      return

    try {
      await onSubmit(e)
      updateState((++submissions.current >= maxSubmissions) ? 5 : 6)
    }
    catch {
      updateState(4)
    }
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