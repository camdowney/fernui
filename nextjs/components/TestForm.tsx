import { IForm, Input, Submit } from '../../packages/react'
import { formToObject } from '../../packages/util'
import { mail } from '../../packages/icons'

export default function TestForm() {
  const testSubmit = async (e: any) =>
    console.log(formToObject(e))

  return (
    <IForm
      onSubmit={testSubmit}
      btn={<Submit icon={mail} />}
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
      </div>
    </IForm>
  )
}