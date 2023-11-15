'use client'

// import { useEffect } from 'react'
// import { initLazyLoad, initScrollView } from '../../packages/react-util'
import 'global.css'

export default ({
  children,
}: {
  children: React.ReactNode
}) => {
  // useEffect(() => {
  //   initLazyLoad()
  //   initScrollView()
  // }, [])
  
  return (
    <html lang='en'>
      <body>
        <script> </script>
        {children}
      </body>
    </html>
  )
}