import {
  Media, Avatar,
  Expand, Dropdown, Lightbox, Repeater,
  InfoForm, Input, Select, FormButton,
} from '../../packages/react'
import { formToObject, toggleUI, getRepeaterMethods, setFieldValue } from '../../packages/util'
import { mail } from '../../packages/icons'

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
          <button onClick={() => setFieldValue('[name="field.0.a"]', '')}>
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
            />
          }
        >
          <div className='grid gap-4'>
            <Input
              name='field.0.a'
              label='Full name *'
              defaultValue='baaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaabaaaaaaaaa'
              rows={1}
              innerClass='resize-none break-all overflow-hidden'
              textarea
              autoResize
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
        <Avatar src='aurora.webp' defaultSrcSet lazy />
        <Avatar src='empty.webp' title='Empty' defaultSrcSet lazy />
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
        <button onClick={() => toggleUI('#lightbox', { index: 1 })}>Lightbox</button>
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