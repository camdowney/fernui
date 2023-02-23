import React from 'react'
import Icon from '../base/Icon'
import { warning } from '../icons'

interface InfoProps {
  visible: boolean | undefined
  children?: any
}

export default function Info({ visible, children }: InfoProps) {
  return !visible ? <></> : (
    <div className='fui-info' style={_style}>
      <Icon i={warning} className='fui-info-icon' />
      {children}
    </div>
  )
}

const _style = {
  display: 'inline-flex',
  alignItems: 'center',
}