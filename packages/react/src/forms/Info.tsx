import React from 'react'
import Cond from '../base/Cond'
import Icon from '../base/Icon'
import { warning } from '../icons'

interface Props {
  visible: boolean
  children?: any
}

export default function Info({ visible, children }: Props) {
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