import { Section, Expand, Modal, Media, Lightbox, Avatar } from '../../packages/react'
import { TestForm } from '../components'
import { toggleExpand, openModal } from '../../packages/util'

export default () => {
  return <>
    <Section>
      <Avatar
        title='Test'
        className='w-12 h-12 rounded-full text-gray-100'
      />
      <TestForm />
    </Section>

    <Section>
      <button onClick={() => toggleExpand('#expand')}>Expand</button>
      <Expand id='expand'>
        Content
      </Expand>
    </Section>

    <Section>
      <button onClick={() => openModal('#dropdown')}>Open dropdown</button>
      <Modal
        id='dropdown'
        bgClass='hidden'
        relative
      >
        Content
      </Modal>
    </Section>

    <Section>
      <button onClick={() => openModal('#lightbox', { index: 1 })}>Open lightbox</button>
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

    <Section>
      <Media
        src='aurora.webp'
        className='pb-[65%]'
      />
    </Section>
  </>
}