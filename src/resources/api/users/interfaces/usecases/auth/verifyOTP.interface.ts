import User from "../../user.interface"

export default interface VerifyOTPInterface {
    execute(email: string, OTP: string, refreshToken: string): Promise<VerifyOTP.Response>
    encryptOTP(OTP: string): string
    generateTokens(id: string): Promise<GenerateToken.Response>
    removeUnwantedFields(user: User): void
}

export namespace VerifyOTP {
    export type Response = {user: User, accessToken: string, refreshToken: string}
}

export namespace GenerateToken {
    export type Response = {accessToken: string, newRefreshToken: string}
}