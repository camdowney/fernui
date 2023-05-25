<script>
  import { cn } from '@fernui/util'

  const {
    as = 'img',
    src,
    srcSet,
    sizes,
    alt,
    className,
    style,
    innerClass,
    placeholder,
    cover,
    outer = true,
    lazy,
    ...props
  } = $$props

  const _defaultStyle = {
    overflow: 'hidden',
    position: 'relative',
    display: 'block',
  }

  const _coverStyle = {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }

  const _placeholderStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundImage: 'linear-gradient(to right, #e0e0e0, #c0c0c0)',
  }

  const _innerStyle = as => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: as !== 'iframe' ? 'cover' : 'initial',
    objectPosition: as !== 'iframe' ? 'center' : 'initial',
  })
</script>

{#if outer}
  <div
    className={cn('fui-media', className)}
    style={{ ...style, ...(cover ? _coverStyle : _defaultStyle) } as Object}
  >
    {placeholder ?? <div className='fui-placeholder' style={_placeholderStyle as Object} />}
    <MediaInner />
  </div>
{:else}
  <MediaInner />
{/if}