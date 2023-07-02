import React from 'react'
import { Text, View, Switch as _Switch, SwitchProps as Props, TextStyle, ViewStyle } from 'react-native'
import { useField } from '@fernui/react-native-util'

export interface SwitchProps extends Props {
  name: string
  value?: boolean 
  onValueChange?: (newValue: boolean) => void
  validate?: (newValue: boolean) => boolean
  defaultValue?: boolean
  editable?: boolean
  style?: ViewStyle
  label?: string
  beforeLabel?: string
  labelStyle?: TextStyle
  inputStyle?: ViewStyle
  error?: string
  errorStyle?: TextStyle
}

export default function Switch({
  name,
  value,
  onValueChange,
  validate = () => true,
  defaultValue = false,
  editable,
  style,
  label,
  beforeLabel,
  labelStyle,
  inputStyle,
  error = 'Please complete this field.',
  errorStyle,
  ...props
}: SwitchProps) {
  const { values, isEditable, onChange, showError } = useField(name, {
    defaultValue,
    validate,
    value,
    onChange: onValueChange,
  })

  return (
    <View style={style}>
      {beforeLabel && <Text style={labelStyle}>{beforeLabel}</Text>}
      <_Switch
        onValueChange={onChange}
        value={values.get(name)}
        disabled={!(editable ?? isEditable)}
        aria-label={label || name}
        style={inputStyle}
        {...props}
      />
      {label && <Text style={labelStyle}>{label}</Text>}
      {error && showError && <Text style={errorStyle}>{error}</Text>}
    </View>
  )
}