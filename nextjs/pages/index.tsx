import { Section, Expand, Lightbox, Modal, Media } from '../../packages/react'
import { TestForm } from '../components'
import { toggleExpand, openModal } from '../../packages/util-react'

export default () => {
  return <>
    <Section>
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
        exitOn={{ click: true }}
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

    <div className='grid grid-cols-2 gap-4'>
      {[...Array.from(Array(200)).map((_, i) =>
        <Media
          src='aurora.webp'
          className='pb-[50%]'
          key={i}
        />
      )]}
    </div>
  </>
}