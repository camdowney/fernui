import React, { useState, useRef } from 'react'
import Link from '../base/Link'
import { useListener } from '../util'

interface SubmitProps {
  text?: string
  [x:string]: any
}

export default function Submit({ text = 'Submit', ...props }: SubmitProps) {
  const [formState, setFormState] = useState<any>({})
  const ref = useRef()

  useListener('FernFormStateChange', (e: any) => {
    setFormState(e.detail.state)
  }, ref)

  return (
    <Link
      innerRef={ref}
      text={text}
      type='submit'
      disabled={formState.disabled}
      {...props}
    />
  )
}