import React, { useRef, useState } from 'react'
import Modal from '../interactive/Modal'
import { cn } from '@fernui/util'
import { useListener } from '../util'

export interface LightboxProps {
  id?: string
  items: any[]
  children: (item: any, index: number, isActive: boolean) => any
  outerClass?: string
  className?: string
  bgClass?: string
  bgActiveClass?: string
  bgInactiveClass?: string
  overlay?: any
  preventScroll?: boolean
}

export default function Lightbox({
  id,
  items = [],
  children,
  outerClass,
  className,
  bgClass,
  bgActiveClass,
  bgInactiveClass,
  overlay,
  preventScroll,
}: LightboxProps) {
  const ref = useRef<any>()
  const active = useRef<boolean | null>(null)
  const [index, setIndex] = useState(0)

  const getItems = () =>
    [...ref.current.lastChild.children].slice(0, -1)

  const cyclePrevious = () =>
    setIndex(index > 0 ? index - 1 : getItems().length - 1)

  const cycleNext = () =>
    setIndex(index < getItems().length - 1 ? index + 1 : 0)
    
  const onChange = (newActive: boolean) =>
    active.current = newActive

  const onAction = (e: any) => {
    if (e.detail?.index == null) return
    setIndex(e.detail.index)
  }

  useListener('keydown', (e: any) => {
    if (e.repeat || !active.current || getItems().length < 2)
      return

    const key = e?.key?.toLowerCase()

    if (key === 'arrowleft' || key === 'a')
      cyclePrevious()
    else if (key === 'arrowright' || key === 'd')
      cycleNext()
  })

  useListener('FUILightboxAction', (e: any) => {
    if (!active.current || getItems().length < 2)
      return

    const { action } = e.detail

    if (action === 0)
      cyclePrevious()
    else if (action === 1)
      cycleNext()
  }, ref)

  return (
    <Modal
      innerRef={ref}
      className={cn('fui-lightbox', className)}
      bgClass={cn('fui-lightbox-bg', bgClass)}
      {...{ id, outerClass, onChange, onAction, bgActiveClass, bgInactiveClass, preventScroll }}
    >
      {items.map((item, i) =>
        children(item, i, i === index)
      )}
      <span>
        {overlay}
      </span>
    </Modal>
  )
}