import { useEffect } from 'react'

export * from '../../fernutil'

export const useCustomListener = (element, event, callback, passive) => {
  useEffect(() => {
    element.addEventListener(event, callback, { passive })
    return () => element.removeEventListener(event, callback, { passive })
  }, [event, callback])
}

export const useWindowListener = (event, callback, passive) => {
  useEffect(() => {
    window.addEventListener(event, callback, { passive })
    return () => window.removeEventListener(event, callback, { passive })
  }, [event, callback])
}

export const onLoad = callback =>
	useEffect(callback, [])

export const onScroll = callback => 
	useWindowListener('scroll', callback, true)

export const onClick = callback =>
	useWindowListener('mousedown', callback)

export const onResize = callback =>
	useWindowListener('resize', callback)

export const onKeydown = callback =>
	useWindowListener('keydown', callback)