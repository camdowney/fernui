import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@fernui/util'
import { useListener } from '@fernui/react-util'

export interface ExpandProps {
  domRef?: any
  active: boolean
  className?: string
  children?: any
  [props: string]: any
}

export default function Expand({
  domRef,
  active,
  className,
  children,
  ...props
}: ExpandProps) {
  const [height, _setHeight] = useState(0)
  const ref = domRef || useRef()

  const setHeight = () =>
    _setHeight(ref.current.firstChild.clientHeight)

  useEffect(setHeight, [])
  useListener('windowresize', setHeight)

  return (
    <div
      ref={ref}
      className={cn('fui-expand', className)}
      style={styles.expand(active, height)}
      tabIndex={active ? undefined : -1}
      {...props}
    >
      <div>
        {children}
      </div>
    </div>
  )
}

const styles = {
  expand: (active: boolean, height: number) => ({
    overflow: 'hidden',
    maxHeight: active ? height + 'px' : 0,
    transitionProperty: 'max-height',
  }),
}