import React, { Fragment, useState } from 'react'
import { cn, useField, buttonRoleProps } from '@fernui/react-util'
import Error from './Error'

const BYTES_PER_MB = 1_000_000

export interface UploadProps {
  name?: string
  value?: File[]
  onChange?: (newValue: File[]) => void
  acceptedFormats?: string
  maxFileSizeMB?: number
  maxTotalSizeMB?: number
  minFileCount?: number
  maxFileCount?: number
  readOnly?: boolean
  className?: string
  label?: string
  labelClass?: string
  fieldClass?: string
  error?: string
  errorClass?: string
  info?: any
  infoClass?: string
  [props: string]: any
}

export default function Upload({
  name: nameProp,
  value: valueProp = [],
  onChange: onChangeProp,
  acceptedFormats,
  maxFileSizeMB = Infinity,
  maxTotalSizeMB = Infinity,
  minFileCount = 0,
  maxFileCount = Infinity,
  placeholder = 'Select or drop file(s)',
  readOnly,
  className,
  label,
  labelClass,
  fieldClass,
  error = 'Please ensure file(s) meet below criteria.',
  errorClass,
  info,
  infoClass,
  ...props
}: UploadProps) {
  const name = nameProp ?? label ?? placeholder ?? ''

  const validate = (files: File[]) =>
    files.length >= minFileCount
    && files.length <= maxFileCount
    && files.every(file => file.type.match(acceptedFormats ?? '*'))
    && files.every(file => file.size <= maxFileSizeMB * BYTES_PER_MB)
    && files.reduce((totalSize, file) => totalSize + file.size, 0) <= maxTotalSizeMB * BYTES_PER_MB

  const { value, disabled, showError, onChange } = useField(name, valueProp, {
    disabled: readOnly,
    validate,
    onChange: onChangeProp,
  })

  const [dragging, setDragging] = useState(false)

  // Event handlers
  const onClick = () => {
    if (disabled) return

    const picker = document.createElement('input')
    picker.type = 'file'
    picker.setAttribute('multiple', maxFileCount > 1 ? 'true' : 'false')
    picker.setAttribute('accept', acceptedFormats ?? '*')
    
    picker.onchange = (e: any) => handleFiles(e.target.files)
    picker.click()
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

    onChange([...value, ...Array.from(files as File[])])
  }

  const removeFile = (index: number) => {
    if (disabled) return

    value.splice(index, 1)
    onChange([...value])
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
        onClick={onClick}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={onDragOver}
        onDrop={onDrop}
        {...buttonRoleProps({ label: placeholder, disabled })}
        className={cn(
          'fui-upload fui-field-block',
          value.length < 1 && 'fui-upload-empty',
          dragging && 'fui-upload-dragover',
          fieldClass
        )}
        {...props}
      >
        {value.map((file, i) => 
          <Fragment key={i}>
            <span>
              {file.name}
            </span>
            {!disabled && <>
              {' | '}
              <span
                onClick={e => {
                  e.stopPropagation()
                  removeFile(i)
                }}
                {...buttonRoleProps({ label: 'Remove upload', disabled })}
                className='fui-upload-remove'
              >
                Remove
              </span>
            </>}
            <br/>
          </Fragment>
        )}
        {!(disabled && value.length > 0) && (
          <span>
            {placeholder}
          </span>
        )}
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
                acceptedFormats,
                ...((minFileCount > 0 && maxFileCount < Infinity) ? [
                  `${minFileCount} to ${maxFileCount} file${maxFileCount !== 1 ? 's' : ''}`,
                ] : [
                  minFileCount > 0 && `${minFileCount} file${minFileCount !== 1 ? 's' : ''} min`,
                  maxFileCount < Infinity && `${maxFileCount} file${maxFileCount !== 1 ? 's' : ''} max`,
                ]),
                maxFileSizeMB < Infinity && `${maxFileSizeMB}&nbsp;MB&nbsp;per&nbsp;file`,
                maxTotalSizeMB < Infinity && `${maxTotalSizeMB}&nbsp;MB&nbsp;total`,
              ].filter(Boolean).join('; ')
            }} />
          </>}
        </p>
      )}
    </label>
  )
}