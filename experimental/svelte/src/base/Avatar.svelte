<script>
  import { cn } from '@fernui/util'
  import Media from './Media'
  import Icon from './Icon'
  import { profile } from '../icons'

  const defaultColors = letter => (
    'JWHF'.includes(letter) ? '#bb2e94' :   // red
    'SLEIQM'.includes(letter) ? '#7d2b9c' : // purple
    'DRVYOP'.includes(letter) ? '#2d4baf' : // blue
    'CKZXG'.includes(letter) ? '#1c7963' :  // aqua
    '#469310'                               // green 
  )

  const _letterStyle = (firstLetter, colors) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors(firstLetter),
  })

  const { title, src, colors = defaultColors, classes, ...props } = $$props

  const firstLetter = title?.substring(0, 1).toUpperCase()
  const { as, innerClass, placeholder, cover, lazy, ...nonMediaProps } = props

  let validSrc = !!src
</script>

{#if validSrc}
  <Media
    src={src}
    alt={title}
    classes={cn('fui-avatar', classes)}
    onError={() => validSrc = false}
    {...props}
  />
{:else if firstLetter}
  <div
    class={cn('fui-avatar', classes)}
    style={_letterStyle(firstLetter, colors)}
    {...nonMediaProps}
  >
    {firstLetter}
  </div>
{:else}
  <Icon
    i={profile}
    className={cn('fui-avatar', classes)}
    {...nonMediaProps}
  />
{/if}