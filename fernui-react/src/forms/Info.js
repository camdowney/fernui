import React from 'react'
import Cond from '../Cond'
import Icon from '../Icon'
import { warning } from '../_icons'

export default function Info({ visible, children }) {
  return (
    <Cond
      hide={!visible}
      className='fui-info'
      style={infoStyle}
    >
      <Icon i={warning} />
      {children}
    </Cond>
  )
}

const infoStyle = {
  display: 'inline-flex',
  alignItems: 'center',
}