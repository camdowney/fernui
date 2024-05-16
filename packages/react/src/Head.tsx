import React from 'react'
import { getExcerpt } from '@fernui/util'

export interface HeadProps {
  as?: any
  title: string
  description?: string
  icon?: string
  image?: string
  noindex?: boolean
  appleTouchIcon?: string
  themeColor?: string
  children?: any
}

export default function Head({
  as = 'head',
  title,
  description: descriptionProp,
  icon,
  image,
  noindex,
  appleTouchIcon,
  themeColor,
  children,
}: HeadProps) {
  const description = getExcerpt(descriptionProp ?? '', 155)
  const Shell = as

  return (
    <Shell>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width' />

      <title>{title}</title>
      <link rel='icon' href={icon} />
      <link rel='apple-touch-icon' href={appleTouchIcon} />
      <meta name='theme-color' content={themeColor} />

      {noindex && <meta name='robots' content='noindex' />}

      <meta property='og:type' content='article' />
      <meta property='og:title' content={title} />
      {description && <meta name='description' content={description} />}
      {image && <meta property='og:image' content={image} />}

      {children}
    </Shell>
  )
}