import React from 'react'
import Cond from '../base/Cond'
import Icon from '../base/Icon'
import { warning } from '../icons'

interface InfoProps {
  visible: boolean
  children?: any
}

export default function Info({ visible, children }: InfoProps) {
  return (
    <Cond
      hide={!visible}
      className='fui-info'
      style={infoStyle}
    >
      <Icon i={warning} className='fui-info-icon' />
      {children}
    </Cond>
  )
}

const infoStyle = {
  display: 'inline-flex',
  alignItems: 'center',
}