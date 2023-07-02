import React, { useEffect, useState } from 'react'
import { SetState, cn, useListener } from '@fernui/react-util'
import Modal, { ModalProps } from '../interactive/Modal'

export type LightboxIndex = number | 'next' | 'previous' | boolean

export interface LightboxProps extends ModalProps {
  index: LightboxIndex
  setIndex: SetState<LightboxIndex>
  items: any[]
  children: ({ item, index, active }: { item: any, index: number, active: boolean }) => any
  className?: string
  bgClass?: string
  bgActiveClass?: string
  bgInactiveClass?: string
  overlay?: any
}

export default function Lightbox({
  index: _index,
  setIndex: _setIndex,
  items = [],
  children,
  className,
  bgClass,
  bgActiveClass,
  bgInactiveClass,
  overlay,
  ...props
}: LightboxProps) {
  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(0)

  const cyclePrevious = () =>
    setIndex(index > 0 ? index - 1 : items.length - 1)

  const cycleNext = () =>
    setIndex(index < items.length - 1 ? index + 1 : 0)

  useEffect(() => {
    if (_index === false || _index === true)
      return setActive(_index)
    
    if (_index === 'previous')
      return cyclePrevious()

    if (_index === 'next')
      return cycleNext()

    setActive(true)
    setIndex(_index)
  }, [_index])

  useListener('keydown', (e: any) => {
    if (e.repeat || !active || items.length < 2)
      return

    const key = e?.key?.toLowerCase()

    if (key === 'arrowleft' || key === 'a')
      _setIndex('previous')
    else if (key === 'arrowright' || key === 'd')
      _setIndex('next')
  })

  return (
    <Modal
      className={cn('fui-lightbox', className)}
      bgClass={cn('fui-lightbox-bg', bgClass)}
      {...{ ...props, active, setActive, bgActiveClass, bgInactiveClass }}
    >
      {items.map((item, i) =>
        children({ item, index: i, active: i === index })
      )}
      <span>
        {overlay}
      </span>
    </Modal>
  )
}