import { Expand, Modal, Media, Lightbox, Avatar } from '../../packages/react'
import { TestForm } from '../components'
import { toggleExpand, openModal } from '../../packages/util'
import { Repeater } from '../../packages/react'
import { insertRepeaterItem, removeRepeaterItem, updateRepeaterItem } from '../../packages/util'

export default () => {
  return <>
    <section>
      <div className='container'>
        <Repeater id='repeater' items={[]}>
          {(item: any, index, key) =>
            <div key={key}>
              {item.title}
              <br />
              {item.content}
            </div>
          }
        </Repeater>
        <button onClick={() => insertRepeaterItem('#repeater', { title: 't', content: 'c'})}>
          Add item
        </button>
        <button onClick={() => removeRepeaterItem('#repeater', 0)}>
          Remove item
        </button>
        <button onClick={() => updateRepeaterItem('#repeater', { title: 't2', content: 'c2' }, 0)}>
          Update item
        </button>
      </div>
    </section>

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