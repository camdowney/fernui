import { Section, Expand } from 'fernui-react'
import { TestForm } from 'components/ui'
import { toggleExpand } from 'fernutil-react'

export default function Home() {
  return <>
    <Section>
      <TestForm />
    </Section>

    <Section className='bg-gray-200'>
      <button onClick={() => toggleExpand('#expand')}>Expand</button>
      <Expand id='expand'>
        Content
      </Expand>
    </Section>

    <Section>

    </Section>
  </>
}