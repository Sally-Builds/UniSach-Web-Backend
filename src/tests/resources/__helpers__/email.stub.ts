import EmailInterface from '../../../resources/api/email/email.interface';


export default class EmailTest extends EmailInterface {
    public from: string = 'us';
    public to: string = "you"
    public name: string = 'name'
    async send(template: string, subject: string, otp: string, name: string, email: string): Promise<void> {
        this.to = email
        this.from = "Unisach"
        this.name = "user name"
        console.log("Email sent")
    }
    async sendPasswordReset(url: string, email: string, name: string): Promise<void> {
        
    }
    async sendWelcome(url: string, email: string, name: string): Promise<void> {
        
    }

    async EmailVerification(OTP: string, email: string, name: string): Promise<void> {
        
    }
}