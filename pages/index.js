import { Section, Content, Media, Link } from 'fernui-react'
import { Meta, ContactForm } from 'components/ui'

export default function Home() {
  return <>
    <Meta
      title='Home'
      desc=''
      image=''
    />

    <Section>
      <ContactForm />
    </Section>

    <Section className='bg-gray-200'>

    </Section>

    <Section>

    </Section>
  </>
}