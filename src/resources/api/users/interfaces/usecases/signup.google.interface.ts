import User from "../user.interface"
import Exception from "@/utils/exception/Exception"

export default interface SignupInterface {
    execute(first_name: string, last_name: string, email: string, googleID: string, role: string): Promise<Signup.Response>
}

interface SignupResponse {
    user: User,
    accessToken: string
    refreshToken: string
}

export namespace Signup {
    export type Response = SignupResponse
}