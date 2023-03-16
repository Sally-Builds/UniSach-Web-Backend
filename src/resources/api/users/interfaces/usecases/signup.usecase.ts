import User from "../user.interface"
import Exception from "@/utils/exception/Exception"

export default interface SignupInterface {
    execute(first_name: string, last_name: string, email: string, password: string, role: string): Promise<Signup.Response>
}

export namespace Signup {
    export type Response = Omit<User, 'password'> | Exception
}