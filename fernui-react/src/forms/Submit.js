import React, { useState, useRef } from 'react'
import Link from '../Link'
import { useListener } from '../_util'

export default function Submit({ text = 'Submit', ...props }) {
  const [formState, setFormState] = useState({})
  const ref = useRef()

  useListener('FernFieldAction', e => {
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