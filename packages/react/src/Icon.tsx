import React from 'react'
import { oc } from '@fernui/util'

export interface IconProps {
  data: {
    children: string
    [attributes: string]: any
  }
  style?: Object
  [props: string]: any
}

export default function Icon({ data, style, ...props }: IconProps) {
  const { children, ...attributes } = data

  return (
    <svg
      style={oc(styles.icon, style)}
      dangerouslySetInnerHTML={{ __html: children }}
      {...oc(attributes, props)}
    />
  )
}

const styles = {
  icon: {
    flexShrink: 0,
    fill: 'currentcolor',
  },
}