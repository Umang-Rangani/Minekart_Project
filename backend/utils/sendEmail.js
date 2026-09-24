import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

console.log('EMAIL USER:', process.env.EMAIL_USER)
console.log('EMAIL PASS EXISTS:', !!process.env.EMAIL_PASS)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
  bcc = [],
}) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    }

    if (bcc.length > 0) {
      mailOptions.bcc = bcc
    }

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments
    }

    const info = await transporter.sendMail(mailOptions)

    return info
  } catch (error) {
    console.error('sendEmail Error:', error)
    throw error
  }
}