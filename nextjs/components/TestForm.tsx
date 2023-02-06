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
          name='select1'
          options={[
            'Option 1',
            'Option 2',
            'Option 3',
          ]}
        />
      </div>
    </IForm>
  )
}