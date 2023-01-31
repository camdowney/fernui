import { useEffect } from 'react'
import { initLazyLoad, initScrollView } from '../../packages/util'
import 'css/global.css'

export default function App({ Component, pageProps }: any) {
  useEffect(() => {
    initLazyLoad()
    initScrollView()
  }, [])
  
  return <>
    <main>
      <Component {...pageProps} />
    </main>
  </>
}