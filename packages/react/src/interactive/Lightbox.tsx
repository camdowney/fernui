import React, { useState, useRef } from 'react'
import Media from '../base/Media'
import Link from '../base/Link'
import Modal from '../interactive/Modal'
import { cn, closeModal } from '@fernui/util'
import { useListener } from '../util'
import { angle, close } from '../icons'

export interface LightboxProps {
  id?: string
  sources: string[]
  defaultSrcSet?: boolean
  className?: string
  bgClass?: string
  activeClass?: string
  inactiveClass?: string
  customOverlay?: any
  overlayClass?: string
  controlClass?: string
  iconClass?: string
}

export default function Lightbox({
  id,
  sources,
  defaultSrcSet,
  className,
  bgClass,
  activeClass = 'fui-lightbox-item-active',
  inactiveClass = 'fui-lightbox-item-inactive',
  customOverlay,
  overlayClass,
  controlClass,
  iconClass
}: LightboxProps) {
  const [current, setCurrent] = useState(0)
  const active = useRef(null) as any

  const cyclePrevious = () =>
    setCurrent(curr => curr > 0 ? curr - 1 : sources.length - 1)

  const cycleNext = () =>
    setCurrent(curr => curr < sources.length - 1 ? curr + 1 : 0)
    
  const onChange = (newActive: boolean) =>
    active.current = newActive

  const onAction = (e: any) =>
    e.detail?.index && setCurrent(e.detail?.index)

  useListener('keydown', (e: any) => {
    if (e.repeat || !active.current)
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
      onChange={onChange}
      onAction={onAction}
      bgClass={cn('fui-lightbox-bg', bgClass)}
      preventScroll
      focus
    >
      <div style={innerStyle as Object}>
        {current >= 0 && sources.map((src, i) => 
          <Media
            src={src}
            className={cn('fui-lightbox-item', current === i ? activeClass : inactiveClass)}
            cover
            defaultSrcSet={defaultSrcSet}
            lazy={false}
            key={i}
          />
        )}
        {customOverlay || (
          <div className={cn('fui-lightbox-overlay', overlayClass)} style={{ position: 'absolute' } as Object}>
            <Link
              label='Close image'
              onClick={closeModal}
              className={cn('fui-lightbox-control', controlClass)}
              style={closeStyle}
              icon={{ i: close, className: cn('fui-lightbox-icon', iconClass) }}
            />
            <Link
              label='Previous image'
              onClick={cyclePrevious}
              className={cn('fui-lightbox-control', controlClass)}
              style={previousStyle}
              icon={{ i: angle, className: cn('fui-lightbox-icon', iconClass) }}
            />
            <Link
              label='Next image'
              onClick={cycleNext}
              className={cn('fui-lightbox-control', controlClass)}
              style={nextStyle}
              icon={{ i: angle, className: cn('fui-lightbox-icon', iconClass) }}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}

const modalStyle = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto',
}

const innerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
}

const closeStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
}

const previousStyle = {
  position: 'absolute',
  top: '50%',
  left: 0,
  transform: 'translateY(-50%) rotate(90deg)',
}

const nextStyle = {
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%) rotate(-90deg)',
}