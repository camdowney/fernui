import axios from 'axios'
import { Form, Input } from 'fernui-react'
import { formToHtml } from 'fernutil-react'
import { SITE_NAME, ADMIN_EMAIL, SENDER_EMAIL } from 'lib/global'

const subject = 'Contact Form Submission'

const composeMail = e => ({
  from: `${SITE_NAME} <${SENDER_EMAIL}>`,
  to: ADMIN_EMAIL,
  replyTo: e.target[1].value,
  subject,
  html: formToHtml(subject, e),
})

export default function ContactForm() {
  const sendEmail = async e =>
    console.log(composeMail(e))
    // await axios.post('/api/mail', composeMail(e))

  return (
    <Form
      className='grid gap-5 mb-6 md:mb-7'
      onSubmit={sendEmail}
      btn={{
        text: 'Submit',
        className: 'btn btn-red',
        icon: 'mail'
      }}
    >
      <Input
        label='Full name *'
        required
      />
      <Input
        type='email'
        label='Email *'
        required
      />
      <Input
        type='area'
        label='How can we help you? *'
        required
      />
    </Form>
  )
}