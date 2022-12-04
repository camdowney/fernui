import { Section, Expand, Lightbox } from 'fernui-react'
import { TestForm } from 'components/ui'
import { toggleExpand, openModal } from 'fernutil-react'

export default function Home() {
  return <>
    <Section>
      <TestForm />
    </Section>

    <Section className='bg-gray-200'>
      <button onClick={() => toggleExpand('#expand')}>Expand</button>
      <Expand id='expand'>
        Content
      </Expand>
    </Section>

    <Section>
      <button onClick={() => openModal('#lightbox', { index: 2 })}>Open lightbox</button>
    </Section>

    <Lightbox
      id='lightbox'
      sources={[
        'aurora.webp',
        'glacier1.webp',
        'glacier2.webp',
        'moraine.webp',
        'yosemite.webp',
      ]}
    />
  </>
}