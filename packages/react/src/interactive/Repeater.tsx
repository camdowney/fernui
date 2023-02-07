import React, { useState, useRef } from 'react'
import { useListener } from '../util'

export interface RepeaterProps {
  innerRef?: any
  as?: any,
  id: string
  items?: any[]
  children: (item: any, index: number, key: number) => any
  [x:string]: any
}

export default function Repeater({
  innerRef,
  as = 'span',
  id,
  items: _items,
  children,
  ...props
}: RepeaterProps) {
  const baseKey = new Date().getTime()
  const Shell = as

  const [items, setItems] = useState<any[]>(_items ?? [])
  const ref = innerRef || useRef()

  const insertItem = (item: any, index?: number) => {
    if (index !== undefined && index >= 0)
      items.splice(index, 0, item)
    else
      items.push(item)

    setItems(items.slice())
  }

  const removeItem = (index?: number) => {
    if (index !== undefined && index >= 0)
      items.splice(index, 1)
    else
      items.pop()

    setItems(items.slice())
  }

  const updateItem = (item: any, index: number) => {
    if (index >= 0)
      items[index] = item

    setItems(items.slice())
  }

  useListener('FUIRepeaterAction', (e: any) => {
    const { action, item, index } = e.detail

    if (action === 0)
      insertItem(item, index)
    else if (action === 1)
      removeItem(index)
    else if (action === 2)
      updateItem(item, index)
  }, ref)

  return (
    <Shell ref={ref} id={id} {...props}>
      {items.map((item, index) =>
        children(item, index, baseKey + index)
      )}
    </Shell>
  )
}