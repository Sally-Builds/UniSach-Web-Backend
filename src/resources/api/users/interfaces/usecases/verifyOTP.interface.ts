import User from "../user.interface"

export default interface VerifyOTPInterface {
    execute(email: string, OTP: string): Promise<VerifyOTP.Response>
}

export namespace VerifyOTP {
    export type Response = {user: User, accessToken: string, refreshToken: string}
}