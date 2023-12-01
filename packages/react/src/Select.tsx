import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@fernui/util'
import { SetState, useField } from '@fernui/react-core-util'
import { useListener } from '@fernui/react-util'
import { angle } from './icons'
import Error from './Error'
import Icon from './Icon'
import Modal from './Modal'

export type Quadrant = [top: boolean | null, left: boolean | null]
export interface Option { label: string, value?: string }

export interface SelectProps {
  name?: string
  value?: string
  options: Option[]
  onChange?: (newValue: string) => void
  validate?: (newValue: string) => boolean
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  labelClass?: string
  fieldClass?: string
  style?: Object
  error?: string
  errorClass?: string
  info?: any
  infoClass?: string
  [props: string]: any
}

export default function Select({
  name: nameProp,
  value: valueProp,
  options,
  onChange,
  validate = () => true,
  placeholder,
  disabled: disabledProp,
  className,
  label,
  labelClass,
  fieldClass,
  style,
  error = 'Please complete this field.',
  errorClass,
  info,
  infoClass,
  ...props
}: SelectProps) {
  const { value, setValue, disabled, showError } = useField({
    name: nameProp ?? label ?? placeholder ?? '',
    value: valueProp ?? (placeholder ? '' : (options[0].value ?? options[0].label)),
    disabled: disabledProp,
    validate,
    onChange,
  })

  const [quadrant, setQuadrantRaw] = useState<Quadrant>([null, null])
  const [active, setActive] = useState(false)
  const ref = useRef<any>()

  const placeholderOrValue = (options.find(o => o.value === value) ?? {}).label || value || placeholder
  const placeholderAndOptions = [...placeholder ? [{ label: placeholder, value: '' }] : [], ...options]

  const setQuadrant = () => {
    const rect = ref.current.getBoundingClientRect()
    setQuadrantRaw([
      rect.top + rect.bottom < window.innerHeight,
      rect.left + rect.right < window.innerWidth
    ])
  }

  useEffect(setQuadrant, [active])
  useListener('windowresize', setQuadrant)
  useListener('scroll', setQuadrant)

  const optionsProps = { active, setActive, setValue, placeholderAndOptions, quadrant }

  return (
    <label className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {/* Label */}
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }

      {/* Field */}
      <span style={{ position: 'relative' }}>
        {quadrant[0] === false && <Options {...optionsProps} />}

        {/* Selector */}
        <button
          ref={ref}
          type='button'
          onClick={() => setActive(curr => !curr)}
          aria-label={label || placeholder || value}
          disabled={disabled}
          className={cn('fui-select fui-field-block', fieldClass)}
          style={{ ..._style, ...style } as object}
          {...props}
        >
          {placeholderOrValue}
          <Icon
            i={angle}
            className='fui-select-icon'
            style={_iconStyle}
          />
        </button>

        {quadrant[0] === true && <Options {...optionsProps} />}
      </span>

      {/* Error */}
      {(error && showError) && (
        <Error text={error} className={errorClass} />
      )}

      {/* Info */}
      {info && (
        <p className={cn('fui-field-info', infoClass)}>
          {info}
        </p>
      )}
    </label>
  )
}

const Options = ({
  active,
  setActive,
  setValue,
  placeholderAndOptions,
  quadrant,
}: {
  active: boolean
  setActive: SetState<boolean>
  setValue: (newValue: string) => void
  placeholderAndOptions: Option[]
  quadrant: Quadrant
}) => (
  <Modal
    active={active}
    setActive={setActive}
    outerClass='fui-select-modal-outer'
    className='fui-select-modal'
    style={_dropdownStyle(quadrant)}
  >
    {placeholderAndOptions.map(option => 
      <button
        type='button'
        onClick={() => {
          setValue(option.value ?? option.label)
          setActive(false)
        }}
        className='fui-select-option'
        key={option.label}
      >
        {option.label}
      </button>    
    )}
  </Modal>
)

const _style = {
  textAlign: 'left',
}

const _iconStyle = {
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
}

const _dropdownStyle = (quadrant: Quadrant) => ({
  ...quadrant[0] ? { top: 0 } : { bottom: 0 },
  ...quadrant[1] ? { left: 0 } : { right: 0 },
  transformOrigin: (quadrant &&quadrant[0] ? 'top' : 'bottom') + (quadrant[1] ? ' left' : ' right')
})