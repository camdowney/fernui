import React from 'react'
import { cn } from '@fernui/util'
import { FormState, FormContext } from '@fernui/react-util'
import Honeypot from './Honeypot'

export interface FormProps {
  context: FormState
  className?: string
  children?: any
  [props: string]: any
}

export default function Form({
  context,
  className,
  children,
  ...props
}: FormProps) {
  const { onSubmit } = context

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