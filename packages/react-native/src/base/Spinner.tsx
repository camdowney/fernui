import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'

export default ({
  duration,
  children,
}: {
  duration: number
  children: any
}) => {
  const spinValue = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue.current, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()

    return () => spinValue.current.stopAnimation()
  }, [spinValue])

  const spin = spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      {children}
    </Animated.View>
  )
}