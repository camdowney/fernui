import React from 'react'
import Icon from '../base/Icon'
import { warning } from '../icons'

interface InfoProps {
  visible: boolean
  children?: any
}

export default function Info({ visible, children }: InfoProps) {
  return !visible ? <></> : (
    <div className='fui-info' style={infoStyle}>
      <Icon i={warning} className='fui-info-icon' />
      {children}
    </div>
  )
}

const infoStyle = {
  display: 'inline-flex',
  alignItems: 'center',
}