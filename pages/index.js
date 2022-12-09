import { Section, Expand, Lightbox, Modal } from 'fernui-react'
import { TestForm } from 'components/ui'
import { toggleExpand, openModal, toggleModal } from 'fernutil-react'

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
      <button onClick={() => openModal('#dropdown')}>Open dropdown</button>
      <Modal
        id='dropdown'
        exitOn={{ click: true }}
        bgClass='hidden'
        relative
      >
        Content
      </Modal>
    </Section>

    <Section className='bg-gray-200'>
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