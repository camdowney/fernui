import {
  Media, Avatar, Link,
  Expand, Dropdown, Lightbox, Repeater,
  InfoForm, Input, Select, FormButton,
} from '../../packages/react'
import { cn, formToObject, toggleUI, getRepeaterMethods, setFieldValue, cyclePrevious, cycleNext } from '../../packages/util'
import { angle, mail } from '../../packages/icons'

export default () => {
  const {
    update: updateItem,
    insert: insertItem,
    remove: removeItem,
    set: setItems,
    get: getItems,
  } = getRepeaterMethods('#repeater')

  const testSubmit = async (e: any) => {
    console.log(formToObject(e.target))
    await new Promise(res => setTimeout(res, 500))
  }

  return <>
    <section>
      <div className='container space-y-4'>
        <div>
          <button onClick={() => setFieldValue('[name="field.0.a"]', 'a')}>
            Update value
          </button>
        </div>
        <InfoForm
          onSubmit={testSubmit}
          maxSubmissions={10}
          requireInitialChanges={false}
          btn={
            <FormButton
              type='submit'
              text='Submit'
              icon={{ i: mail }}
              preventDefaultFocus
            />
          }
        >
          <div className='grid gap-4'>
            <Input
              name='field.0.a'
              label='Full name *'
              rows={1}
              innerClass='resize-none break-all overflow-hidden'
              defaultValue='qwe'
              textarea
              autoResize
              shiftForNewline
              disabled={false}
              required
            />
            <Select
              label='Select *'
              options={[
                { label: 'Option 1' },
                { label: 'Option 2' },
                { label: 'Option 3' },
              ]}
              placeholder=''
              required
            />
            <Repeater
              id='repeater'
              className='space-y-2'
              onChange={newItems => console.log(newItems)}
              hideWhenEmpty
            >
              {(item, index, key) =>
                <Input
                  name={`array.${index}`}
                  label='Label'
                  defaultValue={item}
                  required
                  key={key}
                />
              }
            </Repeater>
          </div>
        </InfoForm>
        <div className='space-x-3'>
          <button onClick={() => insertItem('Added field')}>
            Add item
          </button>
          <button onClick={() => removeItem(0)}>
            Remove item
          </button>
          <button onClick={() => updateItem('Updated field', 0)}>
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
        <Avatar src='aurora.webp' lazy />
        <Avatar src='empty.webp' title='Empty' lazy />
        <Avatar title='j' />
        <Avatar title='s' />
        <Avatar title='d' />
        <Avatar title='c' />
        <Avatar title='b' />
        <Avatar className='bg-blue-500' />
      </div>
    </section>

    <section>
      <div className='container'>
        <button onClick={() => toggleUI('#expand')}>Expand</button>
        <Expand id='expand'>
          Content
        </Expand>
      </div>
    </section>

    <section>
      <div className='container'>
        <button onClick={() => toggleUI('#dropdown')}>Dropdown</button>
        <Dropdown
          id='dropdown'
        >
          Content
        </Dropdown>
      </div>
    </section>

    <section>
      <div className='container'>
        <button onClick={() => toggleUI('#lightbox')}>Lightbox</button>
      </div>
    </section>

    <Lightbox
      id='lightbox'
      items={[
        'aurora.webp',
        'glacier1.webp',
        'glacier2.webp',
        'moraine.webp',
      ]}
      className='m-auto inset-5 max-w-5xl max-h-max'
      overlay={<>
        <Link
          onClick={cyclePrevious}
          className='absolute top-1/2 -translate-y-1/2 left-8 bg-gray-900/70 hover:bg-gray-900/80 text-gray-100 rounded-full p-4'
          icon={{ i: angle, className: 'w-7 rotate-90' }}
        />
        <Link
          onClick={cycleNext}
          className='absolute top-1/2 -translate-y-1/2 right-8 bg-gray-900/70 hover:bg-gray-900/80 text-gray-100 rounded-full p-4'
          icon={{ i: angle, className: 'w-7 -rotate-90' }}
        />
      </>}
    >
      {(src: string, _, active) =>
        <Media
          src={src}
          className={cn('pb-[67%]', !active && '!hidden')}
          lazy={false}
          key={src}
        />
      }
    </Lightbox>

    <section>
      <div className='container'>
        <Media
          src='aurora.webp'
          className='pb-[65%]'
          lazy={false}
          alt=''
        />
      </div>
    </section>
  </>
}