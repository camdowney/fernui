import axios from 'axios'
import { Form, Input, Link } from 'fernui-react'
import { formToHtml, formToValues } from 'fernutil-react'
import { mail } from 'fernicons'
import { SITE_NAME, ADMIN_EMAIL, SENDER_EMAIL } from 'lib/global'

const subject = 'Contact Form Submission'

const composeMail = e => ({
  from: `${SITE_NAME} <${SENDER_EMAIL}>`,
  to: ADMIN_EMAIL,
  replyTo: e.target[1].value,
  subject,
  html: formToHtml(subject, e),
})

export default function TestForm() {
  const sendEmail = async e =>
    console.log(formToValues(e))
    // await axios.post('/api/mail', composeMail(e))

  return (
    <Form onSubmit={sendEmail}>
      <div className='grid gap-5 mb-6 md:mb-7'>
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
          name='test1.1'
          label='Full name *'
          required
        />
        <Input
          name='test1.2.a'
          label='Full name *'
          required
        />
        <Input
          name='test2'
          label='Full name *'
          required
        />
        <Input
          name='test1.2.b.0'
          label='Full name *'
          required
        />
        {/* <Input
          type='email'
          label='Email *'
          required
        />
        <Input
          type='area'
          label='How can we help you? *'
          required
        /> */}
      </div>
      <Link
        type='submit'
        text='Submit'
        className='btn btn-red'
        icon={mail}
      />
    </Form>
  )
}