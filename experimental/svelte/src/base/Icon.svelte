<script>
  const _style = {
    flexShrink: 0,
    fill: 'currentcolor',
  }

  const { i, style, ...props } = $$props
  const { children, ...rest } = i
</script>

<svg
  style={{ ..._style, ...style }}
  {...{ ...rest, ...props}}
>
  {@html children}
</svg>