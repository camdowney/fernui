export const createLazyResizer = ({
  outputDir,
  noResizeSrcPatterns = [],
  sizes = [640, 1024, 1536, 2000],
  placeholderSize = 40,
  scale = 1,
}: {
  outputDir: string
  noResizeSrcPatterns?: RegExp[]
  sizes?: number[]
  placeholderSize?: number
  scale?: number
}) => {
  return {
    getResizeSrc,

    initLazyResize: () => initLazyLoad({ transformSrc: getResizeSrc }),

    getLazyResizeImageProps: (src = '', lazy?: boolean) =>
      lazy ? {
        placeholderStyle: {
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${outputDir}/${placeholderSize}${src}) !important`,
        },
        innerProps: {
          'data-lazy-bg': src,
          'data-lazy-loaded': false,
        },
      }
      : {
        src: getResizeSrc(src),
      },
  }
}