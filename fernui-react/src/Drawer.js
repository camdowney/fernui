import React, { useState, useRef } from 'react'
import { onLoad, onResize, onClick } from './_util'

export default function Drawer({
  id,
  className,
  titleClass,
  title,
  contentClass,
  children,
  duration = '300',
  close
}) {
  const [visible, setVisible] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const drawerRef = useRef()
  const contentRef = useRef()

  onLoad(() => setContentHeight(contentRef.current.clientHeight))
  onResize(() => setContentHeight(contentRef.current.clientHeight))

  onClick(e => {
    if (close && !drawerRef.current.contains(e.target))
      setVisible(false)
  })

  return (
    <div ref={drawerRef} id={id} className={className}>
      <button className={titleClass} onClick={() => setVisible(!visible)}>
        {title}
      </button>
      <div tabIndex={visible ? null : -1} style={wrapperStyles(visible, contentHeight, duration)}>
        <div ref={contentRef} className={contentClass}>
          {children}
        </div>
      </div>
    </div>
  )
}

const wrapperStyles = (visible, contentHeight, duration) => ({
  overflow: 'hidden',
  maxHeight: visible ? contentHeight + 'px' : 0,
  transitionProperty: 'max-height',
  transitionDuration: duration + 'ms',
})