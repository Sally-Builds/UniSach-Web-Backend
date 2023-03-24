import Exception from "@/utils/exception/Exception";
import User from "./user.interface";


export default interface UserRepositoryInterface {
    createUser(data: createUser.Request): Promise<createUser.Response>
    getUserByEmail(email: string): Promise<getUserByEmail.Response>

}

export namespace createUser {
    export type Request = Omit<User, 'id'>;
    export type Response = User;
}

export namespace getUserByEmail {
    export type Response = User | null;
}