<script>
  import { Image, Avatar, Button, Expand, Dropdown, Lightbox, Input, Select, FormButton, Form, TextArea } from '../../packages/svelte/dist'
  import { handleSubmit, useForm, useLightbox, useRepeater } from '../../packages/svelte-util/dist'
  import { cn } from '../../packages/util/dist'
  import { angle } from '../../packages/icons/dist'

  const lightboxItems = [
    'aurora.webp',
    'glacier1.webp',
    'glacier2.webp',
    'moraine.webp',
  ]

  const { items, insert, remove, update } = useRepeater<string>(['1', '2'])
  const [expandActive, setExpandActive] = useState(false)
  const [dropdownActive, setDropdownActive] = useState(false)
  const { control, open, previous, next } = useLightbox(lightboxItems.length)
  const { context, values } = useForm({ defaultValues: { field1: 'test' }})

  const testSubmit = handleSubmit(context, () => {
    console.log(values)
  }, error => {
    console.log(error.message)
  })
</script>

<section>
  <div class='container space-y-4'>
    <Form
      context={context}
      onSubmit={testSubmit}
    >
      <div class='grid gap-4'>
        <Input
          name='field1'
          label='Full name *'
          validate={Boolean}
        />
        <TextArea
          name='field.0.a'
          label='Full name *'
          rows={1}
          fieldClass='resize-none'
          autoResize
          validate={Boolean}
        />
        <Select
          name='select'
          label='Select *'
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2' },
            { label: 'Option 3' },
          ]}
          validate={Boolean}
        />
        <div>
          <h2>Repeater</h2>
          <div class='space-x-3'>
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
            {#each items as [key, item], index}
              <Input
                name={`repeater.${index}`}
                label='Label'
                value={item}
                onChange={newValue => update(newValue, index)}
                key={key}
              />
            {/each}
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
  <div class='container flex gap-2'>
    <Avatar src='aurora.webp' />
    <Avatar src='empty.webp' title='Empty' />
    <Avatar title='j' />
    <Avatar title='s' />
    <Avatar title='d' />
    <Avatar title='c' />
    <Avatar title='b' />
    <Avatar class='bg-blue-500' />
  </div>
</section>

<section>
  <div class='container'>
    <Button
      onClick={() => setExpandActive(curr => !curr)}
      text='Expand'
    />
    <Expand active={expandActive}>
      Content
    </Expand>
  </div>
</section>

<section>
  <div class='container'>
    <Button
      onClick={() => setDropdownActive(curr => !curr)}
      text='Dropdown'
    />
    <Dropdown
      active={dropdownActive}
      setActive={setDropdownActive}
    >
      Content
    </Dropdown>
  </div>
</section>

<section>
  <div class='container'>
    <Button
      onClick={() => open(0)}
      text='Lightbox'
    />
  </div>
</section>

<Lightbox
  control={control}
  items={lightboxItems}
  class='m-auto inset-5 max-w-5xl max-h-max'
>
  {({ item, active }) =>
    <Image
      src={item}
      class={cn(!active && '!hidden')}
      ratioClass='pb-[67%]'
      key={item}
    />
  }
  <svelte:fragment slot='overlay'>
    <Button
      onClick={previous}
      class='absolute top-1/2 -translate-y-1/2 left-8 bg-gray-900/70 hover:bg-gray-900/80 text-gray-100 rounded-full p-4'
      iconBefore={{ i: angle, class: 'w-7 rotate-90' }}
    />
    <Button
      onClick={next}
      class='absolute top-1/2 -translate-y-1/2 right-8 bg-gray-900/70 hover:bg-gray-900/80 text-gray-100 rounded-full p-4'
      iconBefore={{ i: angle, class: 'w-7 -rotate-90' }}
    />
  </svelte:fragment>
</Lightbox>

<section>
  <div class='container'>
    <Image
      src='aurora.webp'
      ratioClass='pb-[65%]'
    />
  </div>
</section>