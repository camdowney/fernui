import { useEffect } from 'react'
import Head from 'next/head'
import { Header, Footer } from 'components'
import { initLazyLoad, initScrollView } from 'fernutil-react'
import 'styles/base.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    initLazyLoad()
    initScrollView()
  }, [])
  
  return <>
    <Head></Head>
    <Header />
    <main>
      <Component {...pageProps} />
    </main>
    <Footer />
  </>
}