import { useState } from 'react'

export const useMap = <T extends unknown>(items: T[]) => {
  const [hovered, setHovered] = useState<T | null>(null)
  const [idsInView, setIdsInView] = useState<number[] | null>(null)
  const itemsInView = items.filter((_, i) => !idsInView || idsInView.some(id => id === i))

  return { setIdsInView, itemsInView, hovered, setHovered }
}