'use client'

import { Media, Avatar, Link, Expand, Dropdown, Lightbox, Input, Select, FormButton, Form, TextArea } from '../../packages/react'
import { cn, FormState, useForm } from '../../packages/react-util'
import { angle, mail } from '../../packages/icons'
import { useEffect, useState } from 'react'

const handleSubmit = (context: FormState, callback: () => any) => async () => {
  const { setEditable, setExposed, isValid } = context
  
  setExposed(true)

  if (!isValid)
    return alert('Invalid input')
  
  try {
    setEditable(false)
    await callback()
  }
  catch (error: any) {
    alert('Error')
  }
  finally {
    setEditable(true)
  }
}

export default () => {
  const { context, values, setValues } = useForm()

  const [expandActive, setExpandActive] = useState(false)
  const [dropdownActive, setDropdownActive] = useState(false)
  const [repeaterItems, setRepeaterItems] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const testSubmit = handleSubmit(context, async () => {
    console.log(values)
  })

  useEffect(() => {
    console.log(lightboxIndex)
  }, [lightboxIndex])

  return <>
    <section>
      <div className='container space-y-4'>
        <div>
          <button onClick={() => setValues(curr => curr)}>
            Update value
          </button>
        </div>
        <Form
          context={context}
          onSubmit={testSubmit}
          btn={
            <FormButton
              type='submit'
              text='Submit'
              iconBefore={{ i: mail }}
              preventDefaultFocus
            />
          }
        >
          <div className='grid gap-4'>
            <TextArea
              name='field.0.a'
              label='Full name *'
              defaultValue='qwe'
              rows={1}
              fieldClass='resize-none break-all overflow-hidden'
              autoResize
              required
            />
            <Select
              name='select'
              label='Select *'
              options={[
                { label: 'Option 1' },
                { label: 'Option 2' },
                { label: 'Option 3' },
              ]}
              required
            />
            {repeaterItems.map((item, index) =>
              <Input
                name={`repeater.${index}`}
                label='Label'
                defaultValue={item}
                required
                key={item}
              />
            )}
          </div>
        </Form>
        <div className='space-x-3'>
          <button onClick={() => setRepeaterItems(curr => ['Added field', ...curr])}>
            Add item
          </button>
          <button onClick={() => setRepeaterItems(curr => curr.slice(0, -1))}>
            Remove item
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
        <button onClick={() => setExpandActive(curr => !curr)}>Expand</button>
        <Expand active={expandActive}>
          Content
        </Expand>
      </div>
    </section>

    <section>
      <div className='container'>
        <button onClick={() => setDropdownActive(true)}>Dropdown</button>
        <Dropdown
          active={dropdownActive}
          setActive={setDropdownActive}
        >
          Content
        </Dropdown>
      </div>
    </section>

    <section>
      <div className='container'>
        <button onClick={() => setLightboxIndex(0)}>Lightbox</button>
      </div>
    </section>

    <Lightbox
      index={lightboxIndex}
      setIndex={setLightboxIndex}
      items={[
        'aurora.webp',
        'glacier1.webp',
        'glacier2.webp',
        'moraine.webp',
      ]}
      className='m-auto inset-5 max-w-5xl max-h-max'
      overlay={<>
        <Link
          onClick={() => setLightboxIndex(-2)}
          className='absolute top-1/2 -translate-y-1/2 left-8 bg-gray-900/70 hover:bg-gray-900/80 text-gray-100 rounded-full p-4'
          iconBefore={{ i: angle, className: 'w-7 rotate-90' }}
        />
        <Link
          onClick={() => setLightboxIndex(-3)}
          className='absolute top-1/2 -translate-y-1/2 right-8 bg-gray-900/70 hover:bg-gray-900/80 text-gray-100 rounded-full p-4'
          iconBefore={{ i: angle, className: 'w-7 -rotate-90' }}
        />
      </>}
    >
      {({ item, active }) =>
        <Media
          src={item}
          className={cn('pb-[67%]', !active && '!hidden')}
          lazy={false}
          key={item}
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