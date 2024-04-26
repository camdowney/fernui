import React from 'react'
import { cn } from '@fernui/util'
import { FormState, FormContext } from '@fernui/react-util'
import { useListener } from '@fernui/react-util'
import Honeypot from './Honeypot'

export interface FormProps {
  context: FormState
  promptBeforeUnload?: boolean
  className?: string
  children?: any
  [props: string]: any
}

export default function Form({
  context,
  promptBeforeUnload,
  className,
  children,
  ...props
}: FormProps) {
  const { hasChanges, onSubmit } = context

  useListener('beforeunload', (e: any) => {
    if (promptBeforeUnload && hasChanges) {
      e.preventDefault()
      e.returnValue = ''
    }
  })

  return (
    <FormContext.Provider value={context}>
      <form
        method='post'
        className={cn('fui-form', className)}
        noValidate
        {...onSubmit && { onSubmit }}
        {...props}
      >
        {children}
        <Honeypot />
      </form>
    </FormContext.Provider>
  )
}