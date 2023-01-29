import sg from '@sendgrid/mail'
sg.setApiKey(process.env.SENDGRID_API_KEY ?? '')

export default async (req: any, res: any) => {
  const mail = req.body

  if (req.method !== 'POST' || !mail)
    return res.status(400).json({ msg: 'Contact: Not found' })

  try {
    await sg.send(mail)

    return res.status(200).json({ msg: 'Contact: Success!' })
  }
  catch (err) {
    return res.status(500).json({ msg: 'Contact: Error', err })
  }
}