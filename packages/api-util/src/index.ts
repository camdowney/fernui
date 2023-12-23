import { KeyObject } from '@fernui/util'

export interface MailHeaderData {
  to?: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string | string[]
  subject?: string
}

export type MailHeaders = MailHeaderData | ((values: KeyObject) => MailHeaderData)

export interface MailData extends MailHeaderData {
  from: string
  html?: string
  text?: string
}

export interface UploadData {
  name: string
  data: string
}