import React from 'react'
import Icon from '../base/Icon'
import { warning } from '../icons'

interface InfoProps {
  visible: boolean | undefined
  children?: any
}

export default function Info({ visible, children }: InfoProps) {
  return visible ? (
    <div className='fui-field-info'>
      <Icon i={warning} className='fui-field-info-icon' />
      {children}
    </div>
  ) : (
    <></>
  )
}