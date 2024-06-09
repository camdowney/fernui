import React from 'react'
import { cn } from '@fernui/util'
import { LightboxControl } from '@fernui/react-util'
import Dialog, { DialogProps } from './Dialog'

export interface LightboxProps extends Omit<DialogProps, 'active' | 'setActive'>{
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
  const { index, active, setActive } = control

  return (
    <Dialog
      className={cn('fui-lightbox', className)}
      {...{ ...props, active, setActive }}
    >
      {items.map((item, i) =>
        children({ item, index: i, active: i === index })
      )}
      <span>
        {overlay}
      </span>
    </Dialog>
  )
}