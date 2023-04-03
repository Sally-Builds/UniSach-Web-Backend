import User from "../../user.interface"

export default interface LoginInterface {
    execute(email: string, password: string, refreshToken: string): Promise<Login.Response>
    generateTokens(id: string): Promise<GenerateToken.Response>
    removeUnwantedFields(user: User): void
}

export interface NotVerified {
    email: string,
    message: string,
}

export interface Verified {
    user: User,
    accessToken: string,
    refreshToken: string
}

export namespace Login {
    export type Response =  NotVerified | Verified
}

export namespace GenerateToken {
    export type Response = {accessToken: string, newRefreshToken: string}
}