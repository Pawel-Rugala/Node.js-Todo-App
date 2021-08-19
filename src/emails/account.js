require('dotenv').config()
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRIDAPI)

const sendWelcomeEmail = (email, name) => {
 sgMail.send({
  to: email,
  from: 'webdevpablo@gmail.com',
  subject: 'Welcome to this course',
  text: `
      Hello ${name} and welcome to this extensive course!
      # HTML bla bla bla
    `,
  html: `
   Hello ${name} and welcome to this <b>extensive course</b>!
  `,
 })
}

const sendCancelEmail = (email, name) => {
 sgMail.send({
  to: email,
  from: 'webdevpablo@gmail.com',
  subject: 'Please.. come back',
  text: `
      Hello ${name}, please let me know why you cancel your account!
      # HTML bla bla bla
    `,
  html: `
   Hello ${name} and welcome to this <b>please let me know why you cancel your account</b>!
  `,
 })
}

module.exports = { sendWelcomeEmail, sendCancelEmail }
