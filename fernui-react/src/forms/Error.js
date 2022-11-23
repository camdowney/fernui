import React from 'react'
import Cond from '../Cond'
import Icon from '../Icon'

export default function Error({ visible, children }) {
  return (
    <Cond
      hide={!visible}
      className='fui-error'
      style={errorStyles}
    >
      <Icon i='warning' />
      {children}
    </Cond>
  )
}

const errorStyles = {
  display: 'inline-flex',
  alignItems: 'center',
}