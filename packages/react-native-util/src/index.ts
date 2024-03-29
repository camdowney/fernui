import { useEffect, useState } from 'react'
import { Alert, AlertButton, Keyboard } from 'react-native'

export * from '@fernui/react-core-util'

export const margin = (t: number, r?: number, b?: number, l?: number) => ({
  marginTop: t,
  marginRight: r ?? t,
  marginBottom: b ?? t,
  marginLeft: l ?? r ?? t,
})

export const padding = (t: number, r?: number, b?: number, l?: number) => ({
  paddingTop: t,
  paddingRight: r ?? t,
  paddingBottom: b ?? t,
  paddingLeft: l ?? r ?? t,
})

export const alert = (
  title: string,
  message?: string,
  buttons: AlertButton[] = [{ text: 'OK' }]
) => {
  Alert.alert(title, message, buttons)
}

export const useKeyboardVisible = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setVisible(true))
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setVisible(false))
 
    return () => {
      showListener.remove()
      hideListener.remove()
     }
  }, [])

  return visible
}