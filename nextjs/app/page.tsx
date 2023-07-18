'use client'

import { useState } from 'react'
import { Media, Avatar, Link, Expand, Dropdown, Lightbox, Input, Select, FormButton, Form, TextArea } from '../../packages/react/dist'
import { FormState, useForm, useLightbox, useRepeater } from '../../packages/react-core-util/dist'
import { cn } from '../../packages/react-util/dist'
import { angle } from '../../packages/icons/dist'

const handleSubmit = (context: FormState, callback: () => any) => async (e: any) => {
  e.preventDefault()
  
  const { setDisabled, setExposed, isValid, fields } = context

  console.log(fields)
  
  setExposed(true)

  if (!isValid)
    return alert('Invalid input')
  
  try {
    setDisabled(true)
    await callback()
    alert('Success')
  }
  catch (error: any) {
    alert('Error')
  }
  finally {
    setDisabled(false)
  }
}

export default () => {
  const { context, data } = useForm()

  const { items, insert, remove, update } = useRepeater<string>([
    '1',
    '2',
  ])

  const [expandActive, setExpandActive] = useState(false)
  const [dropdownActive, setDropdownActive] = useState(false)

  const lightboxItems = [
    'aurora.webp',
    'glacier1.webp',
    'glacier2.webp',
    'moraine.webp',
  ]

  const { control, open, previous, next } = useLightbox(lightboxItems.length)

  const testSubmit = handleSubmit(context, async () => {
    console.log(data)
  })

  return <>
    <section>
      <div className='container space-y-4'>
        <Form
          context={context}
          onSubmit={testSubmit}
        >
          <div className='grid gap-4'>
            <Input
              name='field1'
              label='Full name *'
              validate={Boolean}
            />
            <TextArea
              name='field.0.a'
              label='Full name *'
              rows={1}
              fieldClass='resize-none' // break-all overflow-hidden
              autoResize
              validate={Boolean}
            />
            <Select
              name='select'
              label='Select *'
              options={[
                { label: 'Option 1' },
                { label: 'Option 2' },
                { label: 'Option 3' },
              ]}
              validate={Boolean}
            />
            <div>
              <h2>Repeater</h2>
              <div className='space-x-3'>
                <FormButton
                  onClick={() => insert('New field')}
                  text='Add item'
                />
                <FormButton
                  onClick={() => remove(0)}
                  text='Remove item'
                />
              </div>
              <div>
                {items.map(([key, item], index) =>
                  <Input
                    name={`repeater.${index}`}
                    label='Label'
                    value={item}
                    onChange={newValue => update(newValue, index)}
                    key={key}
                  />
                )}
              </div>
            </div>
          </div>
          <FormButton
            type='submit'
            text='Submit'
          />
        </Form>
      </div>
    </section>

    <section>
      <div className='container flex gap-2'>
        <Avatar src='aurora.webp' />
        <Avatar src='empty.webp' title='Empty' />
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
        <button onClick={() => open()}>Lightbox</button>
      </div>
    </section>

    <Lightbox
      control={control}
      items={lightboxItems}
      className='m-auto inset-5 max-w-5xl max-h-max'
      overlay={<>
        <Link
          onClick={previous}
          className='absolute top-1/2 -translate-y-1/2 left-8 bg-gray-900/70 hover:bg-gray-900/80 text-gray-100 rounded-full p-4'
          iconBefore={{ i: angle, className: 'w-7 rotate-90' }}
        />
        <Link
          onClick={next}
          className='absolute top-1/2 -translate-y-1/2 right-8 bg-gray-900/70 hover:bg-gray-900/80 text-gray-100 rounded-full p-4'
          iconBefore={{ i: angle, className: 'w-7 -rotate-90' }}
        />
      </>}
    >
      {({ item, active }) =>
        <Media
          src={item}
          className={cn('pb-[67%]', !active && '!hidden')}
          key={item}
        />
      }
    </Lightbox>

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