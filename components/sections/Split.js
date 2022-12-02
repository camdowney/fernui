import { Section } from 'fernui-react'
import { cn } from 'fernutil-react'

export default function Split({ id, className, containerClass, media, children, flipX, flipY, bg }) {
  return (
    <Section
      containerClass={cn('grid lg:grid-cols-2 gap-md', containerClass)}
      {...{ id, className, bg }}
    >
      <div className={cn(flipY && 'order-last', flipX ? 'lg:order-last' : 'lg:order-none')}>
        {media}
      </div>
      <div className='flex flex-col justify-center space-y-md'>
        {children}
      </div>
    </Section>
  )
}