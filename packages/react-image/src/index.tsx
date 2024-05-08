import React, { useEffect } from 'react'
import { cn, oc } from '@fernui/util'
import { type LazyResizeDomFactoryProps, getLazyResizeDomUtils as _getLazyResizeDomUtils } from '@fernui/image-core'

export interface PlaceholderProps {
  src?: string
  lazy?: boolean
  className?: string
  style?: Object
  [props: string]: any
}

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
  imageClass?: string
  imageProps?: Object
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

  const Placeholder = ({
    src,
    lazy = true,
    className,
    style,
    ...props
  }: PlaceholderProps) => {
    const { placeholderSrc }: any = getLazyResizeAttributes(src, lazy)

    return (
      <div
        {...props}
        className={cn(
          'fui-image-placeholder',
          className,
        )}
        style={oc(
          styles.cover,
          styles.placeholder,
          placeholderSrc && { backgroundImage: `url(${placeholderSrc})` },
          style,
        )}
      />
    )
  }

  const Image = ({
    domRef,
    src: srcProp,
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
    imageClass,
    imageProps,
    before,
    after,
    ...props
  }: ImageProps) => {
    const { src, dataLazySrc, dataLazyLoaded }: any = getLazyResizeAttributes(srcProp, lazy)

    useEffect(() => attachLazyResizeHandlers(), [])

    return (
      <div
        ref={domRef}
        className={cn('fui-image', className)}
        style={oc(cover ? styles.cover : styles.outer, style)}
        {...props}
      >
        <div className={cn(ratioClass)}>
          <Placeholder
            src={placeholderSrcProp ?? srcProp}
            lazy={lazy}
            className={cn(innerClass, placeholderClass)}
            style={placeholderStyle}
          />

          {before}

          {/* Image */}
          <div
            {...alt ? { 'aria-label': alt } : { 'role': 'presentation' }}
            {...lazy && {
              'data-lazy-bg': dataLazySrc,
              'data-lazy-loaded': dataLazyLoaded,
            }}
            {...imageProps}
            className={cn(innerClass, imageClass, (imageProps ?? {} as any).className)}
            style={oc(
              styles.image,
              !lazy && { backgroundImage: `url(${src})` },
              (imageProps ?? {} as any).style)
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
    Placeholder,
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