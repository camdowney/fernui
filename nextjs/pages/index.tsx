import { Expand, Modal, Media, Lightbox, Avatar } from '../../packages/react'
import { TestForm } from '../components'
import { toggleExpand, openModal, getRepeaterMethods } from '../../packages/util'
import { Repeater } from '../../packages/react'

export default () => {
  const {
    update: updateItem,
    insert: insertItem,
    remove: removeItem,
    set: setItems,
    get: getItems,
  } = getRepeaterMethods('#repeater')

  return <>
    <section>
      <div className='container space-y-4'>
        <Repeater id='repeater' items={[]} className='space-y-2'>
          {(item, _, key) =>
            <div key={key}>
              {item.title}
              <br />
              {item.content}
            </div>
          }
        </Repeater>
        <div>
          <button onClick={() => insertItem({ title: 't', content: 'c'})}>
            Add item
          </button>
          <button onClick={() => removeItem(0)}>
            Remove item
          </button>
          <button onClick={() => updateItem({ title: 't2' }, 0)}>
            Update item
          </button>
          <button onClick={() => console.log(getItems())}>
            Get items
          </button>
          <button onClick={() => setItems([])}>
            Clear items
          </button>
        </div>
      </div>
    </section>

    <section>
      <div className='container flex gap-2'>
        <Avatar
          src='aurora.webp'
          className='w-12 h-12 rounded-full text-gray-100'
          defaultSrcSet
          lazy
        />
        <Avatar
          src='empty.webp'
          title='Empty'
          className='w-12 h-12 rounded-full text-gray-100'
          defaultSrcSet
          lazy
        />
        <Avatar
          title='c'
          className='w-12 h-12 rounded-full text-gray-100'
        />
        <Avatar
          className='w-12 h-12 rounded-full text-gray-100 bg-blue-500'
        />
      </div>
    </section>
    
    <section>
      <div className='container'>
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
      defaultSrcSet
    />

    <section>
      <div className='container'>
        <Media
          src='aurora.webp'
          className='pb-[65%]'
          defaultSrcSet
          lazy={false}
          alt=''
        />
      </div>
    </section>
  </>
}