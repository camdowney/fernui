import React, { useState, useRef } from 'react'
import { cn } from '@fernui/util'
import { useListener } from '../util'

const isObject = (x: any) => 
  typeof x === 'object' && !Array.isArray(x)

export interface RepeaterProps {
  innerRef?: any
  as?: any
  className?: string
  items?: any[]
  children: (item: any, index: number, key: number) => any
  [x:string]: any
}

export default function Repeater({
  innerRef,
  as = 'span',
  className,
  items: _items,
  children,
  ...props
}: RepeaterProps) {
  const baseKey = new Date().getTime()
  const Shell = as

  const [items, setItems] = useState<any[]>(_items ?? [])
  const ref = innerRef || useRef()

  const insertItem = (item: any, index?: number) => {
    if (index === undefined || index < 0 || index >= items.length)
      items.push(item)
    else
      items.splice(index, 0, item)

    setItems(items.slice())
  }

  const removeItem = (index?: number) => {
    if (index === undefined || index < 0 || index >= items.length)
      items.pop()
    else
      items.splice(index, 1)

    setItems(items.slice())
  }

  const updateItem = (item: any, index: number) => {
    if (index < 0 || index >= items.length)
      return

    if (isObject(item) && isObject(items[index]))
      items[index] = { ...items[index], ...item }
    else
      items[index] = item

    setItems(items.slice())
  }

  useListener('FUIRepeaterAction', (e: any) => {
    const { action, item, index, data } = e.detail

    if (action === 0)
      insertItem(item, index)
    else if (action === 1)
      removeItem(index)
    else if (action === 2)
      updateItem(item, index)
    else if (action === 3)
      setItems(data.items)
    else if (action === 4)
      data.items = items
  }, ref)

  return (
    <Shell
      ref={ref}
      className={cn('fui-listener fui-repeater', className)}
      {...props}
    >
      {items.map((item, index) =>
        children(item, index, baseKey + index)
      )}
    </Shell>
  )
}