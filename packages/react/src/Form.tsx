import React from 'react'
import { cn, FormState, FormContext, useListener } from '@fernui/react-util'
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
  useListener('beforeunload', (e: any) => {
    if (promptBeforeUnload && context.hasChanges) {
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
        {...props}
      >
        {children}
        <Honeypot />
      </form>
    </FormContext.Provider>
  )
}