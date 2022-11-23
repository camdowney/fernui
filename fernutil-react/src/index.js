import { useEffect } from 'react'

export * from '../../fernutil'

export const useListener = (event, callback, passive) => {
  useEffect(() => {
    window.addEventListener(event, callback, { passive })
    return () => window.removeEventListener(event, callback)
  }, [event, callback])
}

export const onLoad = callback =>
	useEffect(callback, [])

export const onScroll = callback => 
	useListener('scroll', callback, true)

export const onClick = callback =>
	useListener('mousedown', callback)

export const onResize = callback =>
	useListener('resize', callback)

export const onKeydown = callback =>
	useListener('keydown', callback)