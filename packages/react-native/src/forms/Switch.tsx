import React from 'react'
import { Text, View, Switch, SwitchProps as Props, TextStyle, ViewStyle } from 'react-native'
import { useField } from '@fernui/react-native-util'

export interface SwitchProps extends Props {
  name: string
  value?: boolean 
  onValueChange?: (newValue: boolean) => void
  style?: ViewStyle
  editable?: boolean
  label?: string
  beforeLabel?: string
  labelStyle?: TextStyle
  inputStyle?: ViewStyle
  defaultValue?: boolean
  error?: string
  errorStyle?: TextStyle
  validate?: (newValue: boolean) => boolean
}

export default ({
  name,
  value,
  onValueChange,
  style,
  editable,
  label,
  beforeLabel,
  labelStyle,
  inputStyle,
  defaultValue = false,
  error = 'Please complete this field.',
  errorStyle,
  validate = () => true,
  ...props
}: SwitchProps) => {
  const { values, isEditable, onChange, showError } = useField(name, {
    defaultValue,
    validate,
    value,
    onChange: onValueChange,
  })

  return (
    <View style={style}>
      {beforeLabel && <Text style={labelStyle}>{beforeLabel}</Text>}
      <Switch
        onValueChange={onChange}
        value={values.get(name)}
        disabled={!(editable ?? isEditable)}
        style={inputStyle}
        {...props}
      />
      {label && <Text style={labelStyle}>{label}</Text>}
      {error && showError && <Text style={errorStyle}>{error}</Text>}
    </View>
  )
}