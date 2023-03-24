export default abstract class EmailInterface {
    protected abstract to: string;
    abstract name: string;
    abstract from: string;

    abstract send(template:string, subject: string, otp:string, name: string): Promise<void>
    abstract EmailVerification(OTP: string, email: string, name: string): Promise<void>
}