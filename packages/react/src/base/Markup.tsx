import React from 'react'
import Cond from './Cond'

interface MarkupProps {
  html: string
  [x:string]: any
}

export default function Markup({ html, ...props }: MarkupProps) {
  return (
    <Cond dangerouslySetInnerHTML={{ __html: html }} {...props} />
  )
}