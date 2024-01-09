import React from 'react'
import { oc } from '@fernui/util'

export interface IconProps {
  i: { children: string }
  style?: Object
  [props: string]: any
}

export default function Icon({ i, style, ...props }: IconProps) {
  const { children, ...rest } = i

  return (
    <svg
      style={oc(styles.icon, style)}
      dangerouslySetInnerHTML={{ __html: children }}
      {...oc(rest, props)}
    />
  )
}

const styles = {
  icon: {
    flexShrink: 0,
    fill: 'currentcolor',
  },
}