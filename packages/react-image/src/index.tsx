import React, { useEffect } from 'react'
import { cn, oc } from '@fernui/util'
import { type LazyResizeDomFactoryProps, getLazyResizeDomUtils as _getLazyResizeDomUtils } from '@fernui/image-core'

export interface ImageProps {
  domRef?: any
  src?: string
  alt?: string
  lazy?: boolean
  cover?: boolean
  placeholderSrc?: string
  placeholderClass?: string
  placeholderStyle?: Object
  className?: string
  style?: Object
  ratioClass?: string
  innerClass?: string
  innerProps?: Object
  before?: any
  after?: any
  [props: string]: any
}

export const getLazyResizeDomUtils = ({
  outputDir,
  placeholderSize = 40,
  ...rest
}: LazyResizeDomFactoryProps) => {
  const {
    isResizable,
    getResizeSrc,
    attachLazyResizeHandlers,
    getLazyResizeAttributes,
  } = _getLazyResizeDomUtils({ outputDir, placeholderSize, ...rest })

  const Image = ({
    domRef,
    src: srcRaw,
    alt,
    lazy = true,
    cover,
    placeholderSrc: placeholderSrcProp,
    placeholderClass,
    placeholderStyle,
    className,
    style,
    ratioClass,
    innerClass,
    innerProps,
    before,
    after,
    ...props
  }: ImageProps) => {
    const {
      src,
      dataLazySrc,
      dataLazyLoaded,
      placeholderSrc: placeholderSrcLazy,
    }: any = getLazyResizeAttributes(srcRaw, lazy)

    const placeholderSrc = placeholderSrcProp ?? placeholderSrcLazy

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
          <div
            className={cn(
              'fui-image-placeholder',
              innerClass,
              placeholderClass,
            )}
            style={oc(
              styles.cover,
              styles.placeholder,
              placeholderSrc && { backgroundImage: `url(${placeholderSrc})` },
              placeholderStyle,
            )}
          />

          {before}

          {/* Image */}
          <div
            {...alt ? { 'aria-label': alt } : { 'role': 'presentation' }}
            {...lazy && {
              'data-lazy-bg': dataLazySrc,
              'data-lazy-loaded': dataLazyLoaded,
            }}
            {...innerProps}
            className={cn(innerClass, (innerProps ?? {} as any).className)}
            style={oc(
              styles.image,
              !lazy && { backgroundImage: `url(${src})` },
              (innerProps ?? {} as any).style)
            }
          />

          {after}
        </div>
      </div>
    )
  }

  return {
    isResizable,
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