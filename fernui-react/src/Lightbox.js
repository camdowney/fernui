import React from 'react'
import Modal from './Modal'
import Media from './Media'
import Link from './Link'
import { cn, closeModal, onKeydown } from './_util'

export default function Lightbox({
  id,
  sources,
  current,
  setCurrent,
  className,
  bgClass,
  overlayClass,
  controlClass,
  iconClass
}) {
  const cyclePrevious = () =>
    setCurrent(curr => curr > 0 ? curr - 1 : sources.length - 1)

  const cycleNext = () =>
    setCurrent(curr => curr < sources.length - 1 ? curr + 1 : 0)

  onKeydown(e => {
    if (e.repeat)
      return

    const key = e?.key?.toLowerCase()

    if (key === 'escape')
      closeModal(`#${id}`)
    else if (key === 'arrowleft' || key === 'a')
      cyclePrevious()
    else if (key === 'arrowright' || key === 'd')
      cycleNext()
  })

  return (
    <Modal
      id={id}
      className={cn('fui-lightbox', className)}
      bgClass={cn('fui-lightbox-bg', bgClass)}
      style={modalStyles}
      lock
      focus
    >
      <div style={innerStyles}>
        {current >= 0 && sources.map((source, i) => 
          <Media
            src={source}
            outerClass={cn('fui-lightbox-item', current === i ? 'fui-lightbox-item-active' : 'fui-lightbox-item-inactive')}
            cover
            priority
            key={i}
          />
        )}
        <div className={cn('fui-lightbox-overlay', overlayClass)} style={{ position: 'absolute' }}>
          <Link
            label='Close image'
            onClick={closeModal}
            className={cn('fui-lightbox-control', controlClass)}
            style={{ ...controlStyles, ...closeStyles }}
            icon='close'
            iconClass={cn('fui-lightbox-icon', iconClass)}
          />
          <Link
            label='Previous image'
            onClick={cyclePrevious}
            className={cn('fui-lightbox-control', controlClass)}
            style={{ ...controlStyles, ...previousStyles }}
            icon='angle'
            iconClass={cn('fui-lightbox-icon', iconClass)}
          />
          <Link
            label='Next image'
            onClick={cycleNext}
            className={cn('fui-lightbox-control', controlClass)}
            style={{ ...controlStyles, ...nextStyles }}
            icon='angle'
            iconClass={cn('fui-lightbox-icon', iconClass)}
          />
        </div>
      </div>
    </Modal>
  )
}

const modalStyles = {
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  margin: 'auto',
}

const innerStyles = {
  position: 'relative',
  width: '100%',
  height: '100%',
}

const controlStyles = {
  position: 'absolute',
  zIndex: '20',
}

const closeStyles = {
  top: '0',
  right: '0',
}

const previousStyles = {
  top: '50%',
  left: '0',
  transform: 'translateY(-50%) rotate(90deg)',
}

const nextStyles = {
  top: '50%',
  right: '0',
  transform: 'translateY(-50%) rotate(-90deg)',
}