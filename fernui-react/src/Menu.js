import React, { useState, useRef } from 'react'
import Link from './Link'
import { cn, onClick, closeAllMenus } from './_util'

export default function Menu({
  id,
  outerClass,
  btn,
  children,
  className,
  transition = 'menu'
}) {
  const [active, setActive] = useState(null)

  const btnRef = useRef()
  const menuRef = useRef()

  onClick(e => {
    if (!btnRef.current.contains(e.target) && !menuRef.current.contains(e.target))
      setActive(false)
  })

  return (
    <span
      id={id}
      className={cn('fui-menu', active ? 'fui-menu-active' : 'fui-menu-inactive', outerClass)}
      style={wrapperStyles}
    >
      <Link
        linkRef={btnRef}
        onClick={() => { closeAllMenus(), setActive(!active) }}
        {...btn}
      />

      <span className='fui-menu-toggle' onClick={() => setActive(!active)} style={{ display: 'none' }} />
      <span className='fui-menu-open' onClick={() => setActive(true)} style={{ display: 'none' }} />
      <span className='fui-menu-close' onClick={() => setActive(false)} style={{ display: 'none' }} />

      <div>
        <menu
          ref={menuRef}
          className={cn(transition + '-' + (active ? 'open' : 'close'), className)}
          aria-hidden={!active}
          style={menuStyles(active)}
        >
          {children}
        </menu>
      </div>
    </span>
  )
}

const wrapperStyles = {
  display: 'inline-flex',
  flexDirection: 'column',
}

const menuStyles = active => ({
  position: 'absolute',
  overflowY: 'auto',
  zIndex: '30',
  visibility: active === null && 'hidden !important',
})