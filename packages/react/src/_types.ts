import { KeyObject } from '@fernui/util'
import { FormState } from '@fernui/react-util'

export interface FieldProps<T> {
  domRef?: any
  context?: FormState
  name?: string
  value?: T
  onChange?: (newValue: T) => void
  validate?: (newValue: T) => boolean
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  labelClass?: string
  fieldClass?: string
  style?: KeyObject
  error?: string
  errorClass?: string
  info?: any
  infoClass?: string
  [props: string]: any
}