import { Expand, Modal, Media, Lightbox, Avatar } from '../../packages/react'
import { TestForm } from '../components'
import { toggleExpand, openModal } from '../../packages/util'

export default () => {
  return <>
    <section>
      <div className='container'>
        <Avatar
          title='Test'
          className='w-12 h-12 rounded-full text-gray-100'
        />
        <TestForm />
      </div>
    </section>

    <section>
      <div className='container'>
        <button onClick={() => toggleExpand('#expand')}>Expand</button>
        <Expand id='expand'>
          Content
        </Expand>
      </div>
    </section>

    <section>
      <div className='container'>
        <button onClick={() => openModal('#dropdown')}>Open dropdown</button>
        <Modal
          id='dropdown'
          bgClass='hidden'
          anchor
        >
          Content
        </Modal>
      </div>
    </section>

    <section>
      <div className='container'>
        <button onClick={() => openModal('#lightbox', { index: 1 })}>Open lightbox</button>
      </div>
    </section>

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

    <section>
      <div className='container'>
        <Media
          src='aurora.webp'
          className='pb-[65%]'
        />
      </div>
    </section>
  </>
}