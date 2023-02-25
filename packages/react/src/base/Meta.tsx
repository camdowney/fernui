import React from 'react'
import { composeExcerpt } from '@fernui/util'

export interface MetaProps {
  as: any
  title: string
  desc?: string
  icon?: string
  image?: string
  canonical?: string
  noindex?: boolean
  touchIcon?: string
  themeColor?: string
  children?: any
}

export default function Meta({
  as = 'head',
  title,
  desc,
  icon,
  image,
  canonical,
  noindex,
  touchIcon,
  themeColor,
  children,
}: MetaProps) {
  const description = composeExcerpt(desc ?? '', 155, false)
  const Shell = as

  return (
    <Shell>
      <title>{title}</title>
      {icon && <link rel='icon' href={icon} />}
      {touchIcon && <link rel='apple-touch-icon' href={touchIcon} />}
      {themeColor && <meta name='theme-color' content={themeColor} />}

      {canonical && <link rel='canonical' href={canonical} />}
      {noindex && <meta name='robots' content='noindex' />}

      <meta property='og:type' content='article' />
      <meta property='og:title' content={title} />
      {description && <meta name='description' content={description} />}
      {image && <meta property='og:image' content={image} />}

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      {description && <meta name='twitter:description' content={description} />}
      {image && <meta name='twitter:image' content={image} />}

      {children}
    </Shell>
  )
}