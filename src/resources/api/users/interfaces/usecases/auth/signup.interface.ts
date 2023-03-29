export default interface SignupInterface {
    execute(first_name: string, last_name: string, email: string, password: string, phone: string, role: string): Promise<Signup.Response>
    otpGenerator(): OtpArtifacts.Response
}

export namespace Signup {
    export type Response = string
}

export namespace OtpArtifacts {
    export type Response = {OTP: string, expiresIn: number, OTPHash: string}
}