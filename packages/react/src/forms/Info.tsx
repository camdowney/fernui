import React from 'react'
import { warning } from '../icons'
import Icon from '../base/Icon'

interface InfoProps {
  visible: boolean | undefined
  children?: any
}

export default function Info({ visible, children }: InfoProps) {
  return visible ? (
    <div className='fui-field-info'>
      <Icon i={warning} className='fui-field-info-icon' />
      <span>{children}</span>
    </div>
  ) : (
    <></>
  )
}