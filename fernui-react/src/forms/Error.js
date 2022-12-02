import React from 'react'
import Cond from '../Cond'
import Icon from '../Icon'
import { warning } from '../_icons'

export default function Error({ visible, children }) {
  return (
    <Cond
      hide={!visible}
      className='fui-error'
      style={errorStyle}
    >
      <Icon i={warning} />
      {children}
    </Cond>
  )
}

const errorStyle = {
  display: 'inline-flex',
  alignItems: 'center',
}