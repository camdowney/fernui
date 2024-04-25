import fs from 'fs'
import sharp from 'sharp'
import { onIntersect } from '@fernui/dom-util'

/**
 * Factory for lazy-load and resize functionality.
 */
export const createLazyResizer = ({
  outputDir,
  noResizeSrcPatterns = [],
  sizes = [640, 1024, 1536, 2000],
  placeholderSize = 40,
  scale = 1,
  intersectOffset = '750px',
}: {
  outputDir: string
  noResizeSrcPatterns?: RegExp[]
  sizes?: number[]
  placeholderSize?: number
  scale?: number
  intersectOffset?: string
}) => {
  /**
   * Returns the most optimally-sized image for an element from an existing folder of resized images.
   * @param src (string) Should match an existing resized image given the structure /[outputDir]/[size]/[src]
   * @param element (HTMLImageElement?) If undefined, the largest available image will be returned.
   */
  const getResizeSrc = (src: string, element?: HTMLImageElement) => {
    if ([...noResizeSrcPatterns, /^http/].some(pattern => src.match(pattern)))
      return src
  
    const sizeRendered = element ? Math.max(element.scrollWidth, element.scrollHeight) : Infinity
    const sizeAdjusted = sizeRendered * scale
    const sizeClean = sizes.find(size => sizeAdjusted < size) ?? sizes.slice(-1)
  
    return `${outputDir}/${sizeClean}${src}`
  }

  /**
   * Attaches scroll listeners to lazy-load and resize all existing images 
   * with data-lazy-src and data-lazy-resize attributes.
   * Should be called on page load and whenever new images are added to the DOM.
   */
  const initLazyResize = () => {  
    const lazyLoad = (isBackground: boolean) => (element: HTMLImageElement) => {
      const dataSrc = element.dataset[isBackground ? 'lazyBg' : 'lazySrc'] ?? ''
      const resizeSrc = getResizeSrc(dataSrc, element)
  
      if (isBackground)
        element.style.backgroundImage = `url(${resizeSrc})`
      else
        element.src = resizeSrc
  
      element.dataset.lazyTransformed = 'true'
      
      const img = new Image()
      img.src = resizeSrc
  
      const loaded = () =>
        element.dataset.lazyLoaded = 'true'
  
      if (img.complete)
        loaded()
      else
        img.onload = loaded
    }

    const offsetStr = `${intersectOffset} ${intersectOffset} ${intersectOffset} ${intersectOffset}`
  
    onIntersect({
      selector: '[data-lazy-src]:not([data-lazy-transformed])',
      callback: lazyLoad(false),
      offset: offsetStr,
    })
  
    onIntersect({
      selector: '[data-lazy-bg]:not([data-lazy-transformed])',
      callback: lazyLoad(true),
      offset: offsetStr,
    })
  }

  /**
   * Returns the necessary attributes for an image to be lazy-loaded and resized.
   * Requires initLazyResize to have been run.
   * @param src (string) Should match an existing resized image given the structure /[outputDir]/[size]/[src]
   * @param lazy (boolean?) If not true, the largest available image will be immediately loaded.
   */
  const getLazyResizeImageAttributes = (src = '', lazy?: boolean) =>
    lazy ? {
      'background-image': `url(${outputDir}/${placeholderSize}${src}) !important`,
      'data-lazy-bg': src,
      'data-lazy-loaded': false,
    }
    : {
      src: getResizeSrc(src),
    }

  return {
    getResizeSrc,
    initLazyResize,
    getLazyResizeImageAttributes,
  }
}

/**
 * Resizes all images in an input directory into an output directory with subdirectories for an array of sizes.
 * Does not modify the input images.
 */
export const resizeLocalImages = ({
  sizes = [640, 1024, 1536, 2000],
  quality = 0.5,
  inputDir = './input',
  outputDir = './output',
}) => {
  if (fs.existsSync(outputDir))
    fs.rmSync(outputDir, { recursive: true })
  
  fs.mkdirSync(outputDir, { recursive: true })
  
  // @ts-ignore
  fs.readdir(inputDir, { recursive: true }, async (error, files) => {
    if (error)
      return console.error(error)
  
    await Promise.all([
      files.map(async (file: string) => {
        sizes.map(async size => {
          if (!file.includes('.')) return

          try {
            const fileLocalPath = file.replace(/\\/g, '/')
            const fileInputPath = `${inputDir}/${fileLocalPath}`
            const fileOutputDir = `${outputDir}/${size}/${fileLocalPath.split('/').slice(0, -1).join('/')}`
            const fileName = (fileLocalPath.split('/').pop() ?? '').split('.')[0]

            if (!fs.existsSync(fileOutputDir))
              fs.mkdirSync(fileOutputDir, { recursive: true })
  
            await sharp(fileInputPath)
              .resize({ width: size, withoutEnlargement: true })
              .webp({ quality: quality * 100 })
              .toFile(`${fileOutputDir}/${fileName}.webp`)
          }
          catch (error) {
            console.error(error)
          }
        })
      }).flat()
    ])
  })
}