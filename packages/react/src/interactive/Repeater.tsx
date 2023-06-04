import React, { useState, useRef } from 'react'
import { cn, useListener } from '@fernui/react-util'

const isObject = (x: any) => 
  typeof x === 'object' && !Array.isArray(x)

export interface RepeaterProps {
  id?: string
  innerRef?: any
  as?: any
  className?: string
  items?: any[]
  children: (item: any, index: number, key: string) => any
  onChange?: (newItems: any[]) => any
  onAction?: (e: any) => any
  hideWhenEmpty?: boolean
  style?: Object
  [x:string]: any
}

export default function Repeater({
  id = String(new Date().getTime()),
  innerRef,
  as = 'span',
  className,
  items: _items = [],
  children,
  onChange,
  onAction,
  hideWhenEmpty,
  style,
  ...props
}: RepeaterProps) {
  const Shell = as
  const ref = innerRef || useRef()

  const [items, setItems] = useState<any[]>(_items)
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

    const newItems = items.slice()
    setItems(newItems)
    onChange?.(newItems)
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
    
    const newItems = items.slice()
    setItems(newItems)
    onChange?.(newItems)
  }

  const updateItem = (item: any, index: number) => {
    if (index < 0 || index >= items.length)
      return

    keys.current[index] = nextIndex.current++

    if (isObject(item) && isObject(items[index]))
      items[index] = { ...items[index], ...item }
    else
      items[index] = item
    
      const newItems = items.slice()
      setItems(newItems)
      onChange?.(newItems)
  }

  const updateAll = (newItems: any[]) => {
    keys.current = [...Array(newItems.length).keys()].map(i => i + nextIndex.current)
    nextIndex.current += newItems.length

    setItems(newItems)
    onChange?.(newItems)
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

    onAction?.(e)
  }, { element: ref })

  return (
    <Shell
      ref={ref}
      id={id}
      className={cn('fui-listener fui-repeater', className)}
      style={{ ...style, display: (hideWhenEmpty && items.length < 1) ? 'none' : undefined }}
      {...props}
    >
      {items.map((item, i) =>
        children(item, i, `${id}-${keys.current[i]}`)
      )}
    </Shell>
  )
}