<script>
  import Icon from './Icon'

  const {
    as,
    to,
    children,
    text,
    icon,
    iconAfter,
    blank,
    label,
    preventDefaultFocus,
    ...props
  } = $$props

  const Shell = as || (to ? 'a' : 'button')

  const onMousedown = e => {
    if (preventDefaultFocus)
      e.preventDefault()
  }
</script>

<Shell
  on:mousedown={onMousedown}
  href={to}
  target={blank && '_blank'}
  rel={blank && 'noopener noreferrer'}
  aria-label={label || text}
  {...props}
>
  {#if icon}
    <Icon {...icon} />
  {/if}
  {children}
  {#if text}
    <span>{text}</span>
  {/if}
  {#if iconAfter}
    <Icon {...iconAfter} />
  {/if}
</Shell>