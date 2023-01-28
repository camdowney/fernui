import React, { useState } from 'react'
import Modal from './Modal'
import Media from './Media'
import Link from './Link'
import { cn, closeModal, useListener } from './_util'
import { angle, close } from './_icons'

export default function Lightbox({
  id,
  sources,
  className,
  bgClass,
  customOverlay,
  overlayClass,
  controlClass,
  iconClass
}) {
  const [current, setCurrent] = useState(0)

  const cyclePrevious = () =>
    setCurrent(curr => curr > 0 ? curr - 1 : sources.length - 1)

  const cycleNext = () =>
    setCurrent(curr => curr < sources.length - 1 ? curr + 1 : 0)

  const onOpen = e =>
    e.detail?.index && setCurrent(e.detail?.index)

  useListener('keydown', e => {
    if (e.repeat)
      return

    const key = e?.key?.toLowerCase()

    if (key === 'arrowleft' || key === 'a')
      cyclePrevious()
    else if (key === 'arrowright' || key === 'd')
      cycleNext()
  })

  return (
    <Modal
      id={id}
      className={cn('fui-lightbox', className)}
      style={modalStyle}
      onAction={onOpen}
      bgClass={cn('fui-lightbox-bg', bgClass)}
      scrollLock
      focus
    >
      <div style={innerStyle}>
        {current >= 0 && sources.map((source, i) => 
          <Media
            src={source}
            className={cn('fui-lightbox-item', 'fui-lightbox-item-' + (current === i ? 'active' : 'inactive'))}
            cover
            priority
            key={i}
          />
        )}
        {customOverlay || (
          <div className={cn('fui-lightbox-overlay', overlayClass)} style={{ position: 'absolute '}}>
            <Link
              label='Close image'
              onClick={closeModal}
              className={cn('fui-lightbox-control', controlClass)}
              style={{ ...controlStyle, ...closeStyle }}
              icon={close}
              iconClass={cn('fui-lightbox-icon', iconClass)}
            />
            <Link
              label='Previous image'
              onClick={cyclePrevious}
              className={cn('fui-lightbox-control', controlClass)}
              style={{ ...controlStyle, ...previousStyle }}
              icon={angle}
              iconClass={cn('fui-lightbox-icon', iconClass)}
            />
            <Link
              label='Next image'
              onClick={cycleNext}
              className={cn('fui-lightbox-control', controlClass)}
              style={{ ...controlStyle, ...nextStyle }}
              icon={angle}
              iconClass={cn('fui-lightbox-icon', iconClass)}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}

const modalStyle = {
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  margin: 'auto',
}

const innerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
}

const controlStyle = {
  position: 'absolute',
  zIndex: '20',
}

const closeStyle = {
  top: '0',
  right: '0',
}

const previousStyle = {
  top: '50%',
  left: '0',
  transform: 'translateY(-50%) rotate(90deg)',
}

const nextStyle = {
  top: '50%',
  right: '0',
  transform: 'translateY(-50%) rotate(-90deg)',
}