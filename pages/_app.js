import { useEffect } from 'react'
import Head from 'next/head'
import { initLazyLoad, initScrollView } from 'packages/util-react'
import 'css/global.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    initLazyLoad()
    initScrollView()
  }, [])
  
  return <>
    <Head />
    <main>
      <Component {...pageProps} />
    </main>
  </>
}