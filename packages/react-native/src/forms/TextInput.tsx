import React from 'react'
import { View, Text, TextInput, TextInputProps as Props, ViewStyle, TextStyle } from 'react-native'
import { useField } from '@fernui/react-native-util'

export interface TextInputProps extends Props {
  name: string
  value?: string
  onChangeText?: (newValue: string) => void
  style?: ViewStyle
  editable?: boolean
  label?: string
  labelStyle?: TextStyle
  inputStyle?: ViewStyle
  defaultValue?: string
  error?: string
  errorStyle?: ViewStyle
  validate?: (newValue: string) => boolean
}

export default ({
  name,
  value,
  onChangeText,
  style,
  editable,
  label,
  labelStyle,
  inputStyle,
  defaultValue = '',
  error = 'Please complete this field.',
  errorStyle,
  validate = () => true,
  ...props
}: TextInputProps) => {
  const { values, isEditable, onChange, showError } = useField(name, {
    defaultValue,
    validate,
    value,
    onChange: onChangeText,
  })

  return (
    <View style={style}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TextInput
        onChangeText={onChange}
        value={values.get(name)}
        editable={editable ?? isEditable}
        style={inputStyle}
        {...props}
      />
      {error && showError && <Text style={errorStyle}>{error}</Text>}
    </View>
  )
}