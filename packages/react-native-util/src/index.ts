import { useEffect, useState } from 'react'
import { Alert, AlertButton, Keyboard, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export * from '@fernui/react-core-util'

export const padding = (t: number, r?: number, b?: number, l?: number) => ({
  paddingTop: t,
  paddingRight: r ?? t,
  paddingBottom: b ?? t,
  paddingLeft: l ?? r ?? t,
})

export const defineStyles = StyleSheet.create

export const alert = (
  title: string,
  message: string,
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

export const useStorage = <T>(key: string, fallbackValue: T) => {
  const [data, _setData] = useState<T>(fallbackValue)

  const setData = async (newValue: T) => {
    await AsyncStorage.setItem(key, JSON.stringify(newValue))
    _setData(newValue)
  }

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(key)
      if (stored) setData(JSON.parse(stored))
    })()
  }, [])

  return [data, setData] as const
}