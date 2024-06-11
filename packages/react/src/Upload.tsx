import React, { useRef, useState } from 'react'
import { cn } from '@fernui/util'
import { openFilePicker } from '@fernui/dom-util'
import { useField, getButtonRoleProps } from '@fernui/react-util'
import { FieldProps } from './_types'
import Error from './Error'

const BYTES_PER_MEGABYTE = 1_000_000

export interface UploadProps extends FieldProps<File[]> {
  trackValue?: boolean
  onAdd?: (newFiles: File[]) => any
  acceptFormats?: string
  maxFileSizeMegabytes?: number
  maxTotalSizeMegabytes?: number
  minFiles?: number
  maxFiles?: number
}

export default function Upload({
  domRef,
  context,
  name: nameProp,
  defaultValue = [],
  onChange,
  trackValue = true,
  onAdd,
  placeholder = 'Select or drop file(s)',
  disabled: disabledProp,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please ensure file(s) meet below criteria.',
  errorClass,
  info,
  infoClass,
  acceptFormats,
  maxFileSizeMegabytes = Infinity,
  maxTotalSizeMegabytes = Infinity,
  minFiles = 0,
  maxFiles = Infinity,
  ...props
}: UploadProps) {
  const ref = domRef || useRef()

  const validate = (files: File[]) =>
    files.length >= minFiles
    && files.length <= maxFiles
    && files.every(file => file.type.match(acceptFormats ?? '*'))
    && files.every(file => file.size <= maxFileSizeMegabytes * BYTES_PER_MEGABYTE)
    && files.reduce((totalSize, file) => totalSize + file.size, 0) <= maxTotalSizeMegabytes * BYTES_PER_MEGABYTE

  const { value, setValue, disabled, showError } = useField({
    context,
    name: nameProp ?? label ?? placeholder ?? '',
    defaultValue,
    disabled: disabledProp,
    validate,
    onChange,
  })

  const [dragging, setDragging] = useState(false)

  // Event handlers
  const onClick = () => {
    if (disabled) return

    openFilePicker({
      callback: handleFiles,
      acceptFormats,
      acceptMultiple: maxFiles > 1,
    })
  }

  const onDragOver = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onDrop = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (!e.dataTransfer.files || disabled) return

    handleFiles(e.dataTransfer.files)
    e.dataTransfer.clearData()
  }

  // Data manipulators
  const handleFiles = async (files: any) => {
    if (!files || files.length < 1) return

    const newFiles = Array.from(files as File[])

    if (onAdd) onAdd(newFiles)
    if (trackValue) setValue([...value, ...newFiles])
  }

  const removeFile = (index: number) => {
    if (disabled) return

    value.splice(index, 1)
    if (trackValue) setValue([...value])
  }

  return (
    <label className={cn('fui-field', showError && 'fui-field-invalid', className)}>
      {/* Label */}
      {label &&
        <div className={cn('fui-field-label', labelClass)}>
          {label}
        </div>
      }

      {/* Field */}
      <div
        ref={ref}
        onClick={onClick}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={onDragOver}
        onDrop={onDrop}
        {...getButtonRoleProps({ label: placeholder, disabled })}
        className={cn(
          'fui-upload fui-field-block',
          value.length < 1 && 'fui-upload-empty',
          dragging && 'fui-upload-dragover',
          fieldClass
        )}
        {...props}
      >
        {value.map((file, i) => 
          <div
            className='fui-upload-file'
            style={styles.placeholder}
            key={i}
          >
            <div className='fui-upload-file-name'>
              {file.name}
            </div>
            <div
              onClick={e => {
                e.stopPropagation()
                removeFile(i)
              }}
              {...getButtonRoleProps({ label: 'Remove upload', disabled })}
              className='fui-upload-file-remove'
            >
              Remove
            </div>
          </div>
        )}

        <div className='fui-upload-placeholder'>
          {placeholder}
        </div>
      </div>

      {/* Error */}
      {(error && showError) && (
        <Error text={error} className={errorClass} />
      )}

      {/* Info */}
      {info !== false && (
        <p className={cn('fui-field-info', infoClass)}>
          {info ?? <>
            Accepts: <span dangerouslySetInnerHTML={{
              __html: [
                acceptFormats,
                ...(minFiles > 0 && maxFiles < Infinity) ? [
                  `${minFiles} to ${maxFiles} file${maxFiles !== 1 ? 's' : ''}`,
                ] : [
                  minFiles > 0 && `${minFiles} file${minFiles !== 1 ? 's' : ''} min`,
                  maxFiles < Infinity && `${maxFiles} file${maxFiles !== 1 ? 's' : ''} max`,
                ],
                maxFileSizeMegabytes < Infinity && `${maxFileSizeMegabytes}&nbsp;MB&nbsp;per&nbsp;file`,
                maxTotalSizeMegabytes < Infinity && `${maxTotalSizeMegabytes}&nbsp;MB&nbsp;total`,
              ].filter(Boolean).join('; ')
            }} />
          </>}
        </p>
      )}
    </label>
  )
}

const styles = {
  placeholder: {
    display: 'flex',
    justifyContent: 'between',
    alignItems: 'center',
  },
}