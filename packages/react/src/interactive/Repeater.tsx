import React, { useState, useRef } from 'react'
import { cn } from '@fernui/util'
import { useListener } from '../util'

const isObject = (x: any) => 
  typeof x === 'object' && !Array.isArray(x)

export interface RepeaterProps {
  id?: string
  innerRef?: any
  as?: any
  className?: string
  items?: any[]
  children: (item: any, index: number, key: string) => any
  [x:string]: any
}

export default function Repeater({
  id,
  innerRef,
  as = 'span',
  className,
  items: _items = [],
  children,
  ...props
}: RepeaterProps) {
  const Shell = as
  const ref = innerRef || useRef()

  const [items, setItems] = useState<any[]>(_items)
  const baseKey = id || new Date().getTime()
  const keys = useRef([...Array(_items.length).keys()])
  const nextIndex = useRef(items.length)

  const insertItem = (item: any, index?: number) => {
    if (index === undefined || index < 0 || index >= items.length) {
      keys.current.push(nextIndex.current++)
      items.push(item)
    }
    else {
      keys.current.splice(index, 0, nextIndex.current++)
      items.splice(index, 0, item)
    }

    setItems(items.slice())
  }

  const removeItem = (index?: number) => {
    if (index === undefined || index < 0 || index >= items.length) {
      keys.current.pop()
      items.pop()
    }
    else {
      keys.current.splice(index, 1)
      items.splice(index, 1)
    }
    
    setItems(items.slice())
  }

  const updateItem = (item: any, index: number) => {
    if (index < 0 || index >= items.length)
      return

    keys.current[index] = nextIndex.current++

    if (isObject(item) && isObject(items[index]))
      items[index] = { ...items[index], ...item }
    else
      items[index] = item
    
    setItems(items.slice())
  }

  const updateAll = (items: any[]) => {
    keys.current = [...Array(items.length).keys()].map(i => i + nextIndex.current)
    nextIndex.current += items.length
    setItems(items)
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
      updateAll(data.items)
    else if (action === 4)
      data.items = items
  }, ref)

  return (
    <Shell
      ref={ref}
      id={id}
      className={cn('fui-listener fui-repeater', className)}
      {...props}
    >
      {items.map((item, i) =>
        children(item, i, `${baseKey}-${keys.current[i]}`)
      )}
    </Shell>
  )
}