import React from 'react'
import Cond from './Cond'

interface Props {
  html: string
  [x:string]: any
}

export default function Markup({ html, ...props }: Props) {
  return (
    <Cond dangerouslySetInnerHTML={{ __html: html }} {...props} />
  )
}