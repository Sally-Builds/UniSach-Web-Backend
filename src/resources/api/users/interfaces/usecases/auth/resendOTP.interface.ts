export default interface ResendOTP {
    execute(email: string): Promise<string>
    otpGenerator(): OtpArtifacts.Response
}

export namespace OtpArtifacts {
    export type Response = {OTP: string, expiresIn: number, OTPHash: string}
}