import React from 'react'
import { View, Text, Pressable, PressableProps, ViewStyle, TextStyle, TextProps } from 'react-native'
import { useField } from '@fernui/react-native-util'

export interface Option { label: string, value?: string }

export interface DisplayOption extends Option {
  selected: boolean
  onPress: () => void
}

export interface SelectProps extends PressableProps {
  name: string
  value?: string
  options: Option[]
  openOptions: ({ label, options }: { label: string, options: DisplayOption[] }) => any
  onSelect?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  placeholder?: string
  placeholderStyle?: TextStyle
  defaultValue?: string
  editable?: boolean
  style?: ViewStyle
  label?: string
  labelStyle?: TextStyle
  inputStyle?: ViewStyle
  inputTextStyle?: TextStyle
  inputTextProps?: TextProps
  error?: string
  errorStyle?: TextStyle
}

export default function Select({
  name,
  value,
  options,
  openOptions: _openOptions,
  onSelect,
  validate = () => true,
  placeholder,
  placeholderStyle,
  defaultValue = '',
  editable,
  style,
  label,
  labelStyle,
  inputStyle,
  inputTextStyle,
  inputTextProps,
  error = 'Please complete this field.',
  errorStyle,
  ...props
}: SelectProps) {
  const { values, isEditable, onChange, showError } = useField(name, {
    defaultValue,
    validate,
    value,
    onChange: onSelect,
  })

  const selectedValue = values.get(name) ?? defaultValue
  const selectedOption = options.find(o => selectedValue === o.label || selectedValue === o.value)
    ?? (placeholder ? { label: undefined } : options[0])

  const openOptions = () => {
    _openOptions({
      label: label ?? placeholder ?? name,
      options: options.map(option => ({
        ...option,
        selected: option.label === selectedOption.label,
        onPress: () => onChange(option.value ?? option.label),
      })),
    })
  }

  return (
    <View style={style}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <Pressable
        onPress={openOptions}
        disabled={!(editable ?? isEditable)}
        style={inputStyle}
        {...props}
      >
        <Text
          style={{ ...inputTextStyle, ...(!selectedOption ? placeholderStyle : {}) }}
          {...inputTextProps}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </Pressable>
      {error && showError && <Text style={errorStyle}>{error}</Text>}
    </View>
  )
}