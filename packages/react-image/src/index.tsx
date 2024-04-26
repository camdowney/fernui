import React, { useEffect } from 'react'
import { cn, oc } from '@fernui/util'
import { type LazyResizeDomFactoryProps, getLazyResizeDomUtils as _getLazyResizeDomUtils } from '@fernui/image-core'

export interface ImageProps {
  domRef?: any
  src?: string
  alt?: string
  lazy?: boolean
  cover?: boolean
  placeholder?: any
  placeholderClass?: string
  placeholderStyle?: Object
  className?: string
  style?: Object
  ratioClass?: string
  innerClass?: string
  innerProps?: Object
  [props: string]: any
}

export const getLazyResizeDomUtils = ({
  outputDir,
  placeholderSize = 40,
  ...rest
}: LazyResizeDomFactoryProps) => {
  const {
    getResizeSrc,
    attachLazyResizeHandlers,
    getLazyResizeAttributes,
  } = _getLazyResizeDomUtils({
    outputDir,
    placeholderSize,
    ...rest
  })

  const Image = ({
    domRef,
    src: srcRaw,
    alt,
    lazy = true,
    cover,
    placeholder,
    placeholderClass,
    placeholderStyle,
    className,
    style,
    ratioClass,
    innerClass,
    innerProps,
    ...props
  }: ImageProps) => {
    const { src, dataLazySrc, dataLazyLoaded, placeholderSrc } = getLazyResizeAttributes(srcRaw, lazy)

    useEffect(() => attachLazyResizeHandlers(), [])

    return (
      <div
        ref={domRef}
        className={cn('fui-image', className)}
        style={oc(cover ? styles.cover : styles.outer, style)}
        {...props}
      >
        <div className={cn(ratioClass)}>
          {/* Placeholder */}
          {placeholder ?? (
            <div
              className={cn('fui-placeholder', placeholderClass)}
              style={oc(
                styles.cover,
                styles.placeholder,
                lazy && { backgroundImage: `url(${placeholderSrc})` },
                placeholderStyle,
              )}
            />
          )}

          {/* Image */}
          <div
            {...alt ? { 'aria-label': alt } : { 'role': 'presentation' }}
            {...lazy && {
              'data-lazy-bg': dataLazySrc,
              'data-lazy-loaded': dataLazyLoaded,
            }}
            className={cn(innerClass)}
            {...innerProps}
            style={oc(
              styles.image,
              !lazy && { backgroundImage: `url(${src})` },
              (innerProps ?? {} as any).style)
            }
          />
        </div>
      </div>
    )
  }

  return {
    getResizeSrc,
    attachLazyResizeHandlers,
    getLazyResizeAttributes,
    Image,
  }
}

const styles = {
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  outer: {
    position: 'relative',
  },
  placeholder: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  },
}