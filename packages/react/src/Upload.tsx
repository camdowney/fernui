import React, { useState } from 'react'
import { cn, useField, textToJSX } from '@fernui/react-util'
import Error from './Error'

// const BYTES_PER_MB = 1_048_576
const BYTES_PER_MB = 1_000_000

export interface UploadFile {
  name: string
  type: string
  data: string
  sizeMB: number
}

export interface UploadProps {
  name?: string
  value?: UploadFile[]
  onChange?: (newValue: UploadFile[]) => void
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
  placeholder,
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

  const validate = (files: UploadFile[]) =>
    files.length >= minFileCount
    && files.length <= maxFileCount
    && files.every(file => file.type.match(acceptedFormats ?? '*'))
    && files.every(file => file.sizeMB <= maxFileSizeMB)
    && files.reduce((totalSize, file) => totalSize + file.sizeMB, 0) <= maxTotalSizeMB

  const { value, disabled, showError, onChange } = useField(name, valueProp, {
    disabled: readOnly,
    validate,
    onChange: onChangeProp,
  })

  const [dragging, setDragging] = useState(false)

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

    if (!e.dataTransfer.files) return

    handleFiles(e.dataTransfer.files)
    e.dataTransfer.clearData()
  }

  const handleFiles = async (files: any) => {
    if (!files || files.length < 1) return

    const newFiles = []

    for (const file of Array.from(files as File[])) {
      const data = await file.text()

      newFiles.push({
        name: file.name,
        type: file.type,
        data,
        sizeMB: data.length / BYTES_PER_MB,
      })
    }

    onChange([...value, ...newFiles])
  }

  const removeFile = (index: number) => {
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
        {...getButtonRoleProps(label || placeholder || name)}
        className={cn(
          'fui-upload fui-field-block',
          value.length < 1 && 'fui-upload-empty',
          dragging && 'fui-upload-dragover',
          fieldClass
        )}
        style={{ cursor: !disabled ? 'pointer' : 'auto' }}
        {...props}
      >
        {value.length > 0 ? (
          value.map((file, i) => 
            <React.Fragment key={i}>
              <span>
                {file.name}
              </span>
              {' | '}
              <span
                onClick={e => {
                  e.stopPropagation()
                  removeFile(i)
                }}
                {...getButtonRoleProps('Remove upload')}
                className='fui-upload-remove'
              >
                Remove
              </span>
              <br/>
            </React.Fragment>
          )
        ) : (
          placeholder
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
            Accepts: {textToJSX([
              acceptedFormats,
              ...((minFileCount > 0 && maxFileCount < Infinity) ? [
                `${minFileCount} to ${maxFileCount} file${maxFileCount !== 1 ? 's' : ''}`,
              ] : [
                minFileCount > 0 && `${minFileCount} file${minFileCount !== 1 ? 's' : ''} min`,
                maxFileCount < Infinity && `${maxFileCount} file${maxFileCount !== 1 ? 's' : ''} max`,
              ]),
              maxFileSizeMB < Infinity && `${maxFileSizeMB}&nbsp;MB&nbsp;per&nbsp;file`,
              maxTotalSizeMB < Infinity && `${maxTotalSizeMB}&nbsp;MB&nbsp;total`,
            ].filter(Boolean).join('; '))}
          </>}
        </p>
      )}
    </label>
  )
}