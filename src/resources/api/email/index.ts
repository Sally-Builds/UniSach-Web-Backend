import pug from 'pug'
import nodemailer, {TransportOptions} from 'nodemailer'
import path = require('path')
import EmailInterface from './email.interface'

interface transport {
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string
    }
}

class Email extends EmailInterface {
    from: string;
    public to: string
    public name: string
    constructor() {
      super()
      this.to = ''
      this.name = ''
      this.from = String(process.env.EMAIL_USERNAME)
    }

   async send(template:string, subject: string, otp:string, name: string) {
    //1) render html based template
    const url = path.resolve(__dirname, '..', '..', '..', '..', `/public/views/${template}.pug`)
    const html = pug.renderFile(`${__dirname}/../../../../public/views/${template}.pug`, {
      subject,
      otp,
      name,
    });

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465, false for other ports
      service: 'gmail',
      logger: true,
      auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    } as TransportOptions);

    //3) create a transport and send email
    const info = await transport.sendMail({
      from: 'Unisach Enterprise <unisach@yahoo.com>', // sender address
      to: this.to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log('Message sent: %s', (info as any).messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl((info as any)));
  }

  //Welcome email
//   async sendWelcome(url:string) {
//     await this.send(
//       'welcome',
//       'Welcome to Cura Healthcare Interoperabilty',
//       url,
//       this.name
//     );
//   }

  //email verification
  async EmailVerification(OTP:string, email: string, name: string) {
    console.log(this.to)
    console.log(OTP)
    this.to = email
    this.name = name
    await this.send('emailVerification', 'Email verification', OTP, this.name);
  }

  //Reset password Email
//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token. Valid for only 10 mins'
//     );
//   }
};

export default Email