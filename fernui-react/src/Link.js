import React from 'react'
import Cond from './Cond'
import Icon from './Icon'

export default function Link({
  as,
  to,
  text,
  icon,
  iconClass,
  blank,
  label,
  linkRef,
  children,
  ...props
}) {
  return (
    <Cond
      as={as || (to ? 'a' : 'button')}
      condRef={linkRef}
      href={to}
      target={blank && '_blank'}
      rel={blank && 'noopener noreferrer'}
      aria-label={label || text}
      {...props}
    >
      <Cond hide={!text} as='span'>
        {text}
      </Cond>
      {children}
      {icon && <Icon i={icon} className={iconClass} />}
    </Cond>
  )
}