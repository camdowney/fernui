import { IForm, Input, Select, FormButton } from '../../packages/react'
import { formToObject } from '../../packages/util'
import { mail } from '../../packages/icons'

export default function TestForm() {
  const testSubmit = async (e: any) =>
    console.log(formToObject(e))

  return (
    <IForm
      onSubmit={testSubmit}
      btn={
        <FormButton
          type='submit'
          text='Submit'
          icon={{ i: mail }}
        />
      }
    >
      <div>
        <Input
          name='key0'
          label='Full name *'
          defaultValue='awd'
          required
        />
        <Input
          name='<h1>.0'
          label='Full name *'
          required
        />
        <Input
          name='<h1>.1.a'
          label='Full name *'
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
      </div>
    </IForm>
  )
}