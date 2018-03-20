'use strict';

import nodemailer from 'nodemailer';

module.exports = class Mail {
  
  static async send(...email, subject, content) {
    let transporter = nodemailer.createTransport({
      service: 'qq',
      auth: {
        user: '1090630516@qq.com',
        pass: 'njzzxgfisuukjgdb'
      }
    })
    let mailOptions = {
      from: 'app-publisher<1090630516@qq.com>',
      to: email,
      subject: subject,
      html: content
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('e-mail send success')
      console.log('Message sent %s', info.messageId)
    })
  }
}