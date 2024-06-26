import { onIntersect } from '@fernui/dom-util'

export interface LazyResizeDomFactoryProps {
  outputDir: string
  noResizeSrcPatterns?: RegExp[]
  sizes?: number[]
  placeholderSize?: number
  scale?: number
  intersectOffset?: string
  lazySrcElements?: Element[]
  lazyBgElements?: Element[]
}

/**
 * Factory for lazy-load and resize functionality.
 */
export const getLazyResizeDomUtils = ({
  outputDir,
  noResizeSrcPatterns = [],
  sizes = [640, 1024, 1536, 2000],
  placeholderSize = 40,
  scale = 1,
  intersectOffset = '750px',
  lazySrcElements,
  lazyBgElements,
}: LazyResizeDomFactoryProps) => {
  /**
   * Based on whether or not a given src starts with http or matches any of the noResizeSrcPatterns.
   * @param src (string)
   * @returns (boolean)
   */
  const isResizable = (src: string) =>
    !([...noResizeSrcPatterns, /^http/].some(pattern => src.match(pattern)))

  /**
   * Returns the most optimally-sized image for an element from an existing folder of resized images.
   * @param src (string) Should match an existing resized image given the structure /[outputDir]/[size]/[src]
   * @param element (HTMLImageElement?) If undefined, the largest available image will be returned.
   */
  const getResizeSrc = (src: string, element?: HTMLImageElement) => {
    if (!isResizable(src)) return src
  
    const sizeRendered = element ? Math.max(element.scrollWidth, element.scrollHeight) : Infinity
    const sizeAdjusted = sizeRendered * scale
    const sizeClean = sizes.find(size => sizeAdjusted < size) ?? sizes.slice(-1)
  
    return `${outputDir}/${sizeClean}${src}`
  }

  /**
   * Attaches scroll listeners to lazy-load and resize all existing images 
   * with data-lazy-src and data-lazy-bg attributes.
   * Should be called on page load and whenever new images are added to the DOM.
   */
  const attachLazyResizeHandlers = () => {  
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
      elements: lazySrcElements,
      callback: lazyLoad(false),
      offset: offsetStr,
    })
  
    onIntersect({
      selector: '[data-lazy-bg]:not([data-lazy-transformed])',
      elements: lazyBgElements,
      callback: lazyLoad(true),
      offset: offsetStr,
    })
  }

  /**
   * Returns the necessary attributes for an image to be lazy-loaded and resized.
   * @param src (string) Should match an existing resized image given the structure /[outputDir]/[size]/[src]
   * @param lazy (boolean?) If not true, the largest available image will be immediately loaded.
   */
  const getLazyResizeAttributes = (src = '', lazy?: boolean) =>
    lazy ? {
      ...isResizable(src) && { placeholderSrc: `${outputDir}/${placeholderSize}${src}` },
      dataLazySrc: src,
      dataLazyLoaded: false,
    }
    : {
      src: getResizeSrc(src),
    }

  return {
    isResizable,
    getResizeSrc,
    attachLazyResizeHandlers,
    getLazyResizeAttributes,
  }
}

/**
 * Resizes all images in an input directory into an output directory with subdirectories for an array of sizes.
 * Does not modify the input images.
 */
export const resizeLocalImages = async ({
  sizes = [40, 640, 1024, 1536, 2000],
  quality = 0.5,
  inputDir = './input',
  outputDir = './output',
}) => {
  const { default: fs } = await import('fs')
  const { default: sharp } = await import('sharp')

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