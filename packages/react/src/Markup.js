import React from 'react'
import Cond from './Cond'

export default function Markup({ html, ...props }) {
  return (
    <Cond dangerouslySetInnerHTML={{ __html: html }} {...props} />
  )
}