import Head from 'next/head'
import { Meta as M } from 'fernui-react'
import { SITE_NAME, SITE_URL } from 'lib/global'
import { getPath } from 'lib/util'

export default function Meta({ title, desc, image, noindex }) {
  const pageTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME

  return (
    <M
      as={Head}
      title={pageTitle}
      desc={desc}
      image={SITE_URL + '/' + image}
      canonical={SITE_URL + getPath()}
      noindex={noindex}
      siteIcon=''
      touchIcon=''
      themeColor='hsl(0, 0%, 98%)'
    />
  )
}