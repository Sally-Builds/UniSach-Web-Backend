import User from "../../user.interface"

export default interface LoginInterface {
    execute(email: string, password: string, refreshToken: string): Promise<Login.Response>
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