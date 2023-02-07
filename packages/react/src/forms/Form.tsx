import React, { useRef } from 'react'
import Honeypot from './Honeypot'
import { cn } from '@fernui/util'
import { useListener } from '../util'

export type FormState = {
  id: number
  end: boolean
  success: boolean
  error: boolean
  disabled: boolean
  message: string
}

export const initialState: FormState = { 
  id: 0, end: false, success: false, error: false, disabled: false, 
  message: 'Initial state'
}

const defaultStates: FormState[] = [
  initialState,
  { id: 1, end: false, success: false, error: false, disabled: true,
    message: 'Submitting...'
  },
  { id: 2, end: false, success: false, error: true, disabled: false,
    message: 'Please correct the highlighted fields.'
  },
  { id: 3, end: true, success: false, error: true, disabled: true,
    message: 'Maximum number of attempts reached.'
  },
  { id: 4, end: false, success: false, error: true, disabled: false,
    message: 'Server error; please retry shortly.'
  },
  { id: 5, end: true, success: true, error: false, disabled: true,
    message: 'Successfully submitted. Thank you!'
  },
  { id: 6, end: false, success: true, error: false, disabled: false,
    message: 'Successfully saved!'
  },
  { id: 7, end: false, success: false, error: false, disabled: false,
    message: 'No changes to be saved.'
  },
]

export interface FormProps {
  className?: string
  children?: any
  states?: FormState[]
  onStateChange?: Function
  onChange?: Function
  onSubmit?: Function
  maxAttempts?: number
  maxSubmissions?: number
  requireChanges?: boolean,
  [x:string]: any
}

export default function Form({
  className,
  children,
  states = defaultStates,
  onStateChange,
  onChange,
  onSubmit,
  maxAttempts = 99,
  maxSubmissions = 1,
  requireChanges = true,
  ...props
}: FormProps) {
  const attempts = useRef(0)
  const submissions = useRef(0)
  const ref = useRef() as any
  const saved = useRef(-1) as any

  const updateState = (newState: number) => {
    const state = states[newState]

    ref.current.querySelectorAll('*').forEach((element: HTMLElement) => {
      element.dispatchEvent(new CustomEvent('FUIFormStateChange', { detail: { state } }))
    })
    
    onStateChange?.(state)
  }

  useListener('input', (e: any) => {
    if (saved.current === -1)
      saved.current = 0

    onChange?.(e)
  }, ref)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (attempts.current++ >= maxAttempts)
      return updateState(3)

    for (const field of e.target.elements) {
      if (field.hasAttribute('data-field-valid') && field.getAttribute('data-field-valid') !== 'true')
        return updateState(2)
    }

    const formData = JSON.stringify(Array.from(new FormData(e.target)))

    if (requireChanges && (saved.current === -1 || saved.current === formData))
      return updateState(7)

    saved.current = formData
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
      ref={ref}
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