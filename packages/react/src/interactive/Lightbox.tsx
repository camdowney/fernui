import React, { useEffect, useState } from 'react'
import { SetState, cn, cycle, useListener } from '@fernui/react-util'
import Modal, { ModalProps } from '../interactive/Modal'

export interface LightboxProps extends Omit<ModalProps, 'active' | 'setActive'> {
  index: number
  setIndex: SetState<number>
  items: any[]
  children: ({ item, index, active }: { item: any, index: number, active: boolean }) => any
  className?: string
  overlay?: any
}

export default function Lightbox({
  index = -1,
  setIndex,
  items = [],
  children,
  className,
  overlay,
  ...props
}: LightboxProps) {
  const [active, setActive] = useState(false)

  const previous = () => setIndex(cycle(items, index, -1))
  const next = () => setIndex(cycle(items, index, 1))

  useEffect(() => {
    if (index === -1 || index < -3 || index > items.length - 1)
      return setActive(false)

    if (index === -2)
      previous()
    else if (index === -3)
      next()

    setActive(true)
  }, [index])

  useListener('keydown', (e: any) => {
    if (e.repeat || !active || items.length < 2)
      return

    const key = e?.key?.toLowerCase()

    if (key === 'arrowleft' || key === 'a')
      previous()
    else if (key === 'arrowright' || key === 'd')
      next()
  })

  return (
    <Modal
      className={cn('fui-lightbox', className)}
      {...{ ...props, active, setActive }}
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