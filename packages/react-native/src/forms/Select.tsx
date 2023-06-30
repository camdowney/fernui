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
  onSelect?: (newValue: string) => void
  style?: ViewStyle
  editable?: boolean
  label?: string
  labelStyle?: TextStyle
  placeholder?: string
  placeholderStyle?: TextStyle
  options: Option[]
  openOptions: ({ label, options }: { label: string, options: DisplayOption[] }) => any
  inputStyle?: ViewStyle
  inputTextStyle?: TextStyle
  inputTextProps?: TextProps
  defaultValue?: string
  error?: string
  errorStyle?: TextStyle
  validate?: (newValue: string) => boolean
}

export default ({
  name,
  value,
  onSelect,
  style,
  editable,
  label,
  labelStyle,
  placeholder,
  placeholderStyle,
  options,
  openOptions,
  inputStyle,
  inputTextStyle,
  inputTextProps,
  defaultValue = '',
  error = 'Please complete this field.',
  errorStyle,
  validate = () => true,
  ...props
}: SelectProps) => {
  const { values, isEditable, onChange, showError } = useField(name, {
    defaultValue,
    validate,
    value,
    onChange: onSelect,
  })

  const selectedValue = values.get(name) ?? defaultValue
  const selectedOption = options.find(o => selectedValue === o.label || selectedValue === o.value)
    ?? (placeholder ? null : options[0])

  const _openOptions = () => {
    openOptions({
      label: label ?? placeholder ?? name,
      options: options.map(option => ({
        ...option,
        selected: option.label === selectedOption?.label,
        onPress: () => onChange(option.value ?? option.label),
      })),
    })
  }

  return (
    <View style={style}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <Pressable
        onPress={_openOptions}
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