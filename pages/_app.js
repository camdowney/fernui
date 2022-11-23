import Head from 'next/head'
import { Header, Footer } from 'components/sections'
import { onLoad, scrollView, lazyLoad } from 'fernutil-react'
import 'styles/base.css'

export default function App({ Component, pageProps }) {
  onLoad(() => {
    scrollView()
    lazyLoad()
  })
  
  return <>
    <Head></Head>
    <Header />
    <main>
      <Component {...pageProps} />
    </main>
    <Footer />
  </>
}