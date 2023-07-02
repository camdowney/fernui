import React from 'react'
import { View, Text, TextInput as _TextInput, TextInputProps as Props, ViewStyle, TextStyle } from 'react-native'
import { useField } from '@fernui/react-native-util'

export interface TextInputProps extends Props {
  name: string
  value?: string
  onChangeText?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  defaultValue?: string
  editable?: boolean
  style?: ViewStyle
  label?: string
  labelStyle?: TextStyle
  inputStyle?: ViewStyle
  error?: string
  errorStyle?: ViewStyle
}

export default function TextInput({
  name,
  value,
  onChangeText,
  validate = () => true,
  placeholder,
  defaultValue = '',
  editable,
  style,
  label,
  labelStyle,
  inputStyle,
  error = 'Please complete this field.',
  errorStyle,
  ...props
}: TextInputProps) {
  const { values, isEditable, onChange, showError } = useField(name, {
    defaultValue,
    validate,
    value,
    onChange: onChangeText,
  })

  return (
    <View style={style}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <_TextInput
        onChangeText={onChange}
        value={values.get(name)}
        editable={editable ?? isEditable}
        aria-label={label || placeholder || name}
        style={inputStyle}
        {...props}
      />
      {error && showError && <Text style={errorStyle}>{error}</Text>}
    </View>
  )
}