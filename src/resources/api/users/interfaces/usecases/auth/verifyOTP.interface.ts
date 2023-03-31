import User from "../../user.interface"

export default interface VerifyOTPInterface {
    execute(email: string, OTP: string, refreshToken: string): Promise<VerifyOTP.Response>
    encryptOTP(OTP: string): string
}

export namespace VerifyOTP {
    export type Response = {user: User, accessToken: string, refreshToken: string}
}