import React from 'react'
import { cn } from '@fernui/util'
import { LightboxControl } from '@fernui/react-core-util'
import { useListener } from '@fernui/react-util'
import Modal, { ModalProps } from './Modal'

export interface LightboxProps extends Omit<ModalProps, 'active' | 'setActive'>{
  control: LightboxControl
  items: any[]
  children: ({ item, index, active }: { item: any, index: number, active: boolean }) => any
  className?: string
  overlay?: any
}

export default function Lightbox({
  control,
  items = [],
  children,
  className,
  overlay,
  ...props
}: LightboxProps) {
  const { index, active, setActive, previous, next } = control

  useListener('keydown', (e: any) => {
    if (e.repeat || !active || items.length < 2)
      return

    const key = e.key.toLowerCase()

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