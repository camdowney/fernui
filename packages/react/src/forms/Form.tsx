import React, { useEffect, useRef } from 'react'
import Honeypot from './Honeypot'
import { cn } from '@fernui/util'

const stringifyForm = (target: any) =>
  JSON.stringify(Array.from(new FormData(target)))

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
  onStateChange?: (newState: FormState) => void
  onSubmit?: (e: any) => any
  maxAttempts?: number
  maxSubmissions?: number
  requireChanges?: boolean
  requireInitialChanges?: boolean
  [x:string]: any
}

export default function Form({
  className,
  children,
  states = defaultStates,
  onStateChange,
  onSubmit: _onSubmit,
  maxAttempts = -1,
  maxSubmissions = 1,
  requireChanges = true,
  requireInitialChanges = true,
  ...props
}: FormProps) {
  const attempts = useRef(0)
  const submissions = useRef(0)
  const ref = useRef<any>()
  const saved = useRef<any>(null)

  useEffect(() => {
    if (requireChanges)
      saved.current = requireInitialChanges ? stringifyForm(ref.current) : 1
  }, [])

  const updateState = (newState: number) => {
    const state = states[newState]

    ref.current.querySelectorAll('*').forEach((element: HTMLElement) => {
      element.dispatchEvent(new CustomEvent('FUIFormStateChange', { detail: { state } }))
    })
    
    onStateChange?.(state)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()

    if (maxAttempts > 0 && attempts.current++ >= maxAttempts)
      return updateState(3)

    for (const field of e.target.elements) {
      if (field.hasAttribute('data-field-valid') && field.getAttribute('data-field-valid') !== 'true')
        return updateState(2)
    }

    const formData = stringifyForm(e.target)

    if (requireChanges && (!saved.current || saved.current === formData))
      return updateState(7)

    updateState(1)

    if (!_onSubmit)
      return

    try {
      await _onSubmit(e)

      if (requireChanges)
        saved.current = formData

      updateState((maxSubmissions > 0 && ++submissions.current >= maxSubmissions) ? 5 : 6)
    }
    catch (err) {
      console.error(err)
      updateState(4)
    }
  }

  return (
    <form
      ref={ref}
      method='post'
      onSubmit={onSubmit}
      className={cn('fui-form', className)}
      noValidate
      {...props}
    >
      <Honeypot />
      {children}
    </form>
  )
}