import { IForm, Input, Submit } from '../../packages/react'
import { formToObject } from '../../packages/util-react'
import { mail } from '../../packages/icons'

export default function TestForm() {
  const testSubmit = async (e: any) =>
    console.log(formToObject(e))

  return (
    <IForm
      onSubmit={testSubmit}
      btn={
        <Submit icon={mail} />
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
    </IForm>
  )
}