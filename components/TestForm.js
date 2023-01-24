import { InteractForm, Input, Submit } from 'fernui-react'
import { formToObject } from 'fernutil-react'
import { mail } from 'fernicons'

export default function TestForm() {
  const testSubmit = async e =>
    console.log(formToObject(e))

  return (
    <InteractForm
      onSubmit={testSubmit}
      btn={
        <Submit
          icon={mail}
        />
      }
    >
      <div>
        <Input
          name='test0'
          label='Full name *'
          required
        />
        <Input
          name='test1.0'
          label='Full name *'
          required
        />
        <Input
          name='test1.1.a'
          label='Full name *'
          required
        />
      </div>
    </InteractForm>
  )
}