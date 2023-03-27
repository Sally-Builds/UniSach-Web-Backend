import Exception from "@/utils/exception/Exception";
import User from "./user.interface";


export default interface UserRepositoryInterface {
    createUser(data: createUser.Request): Promise<createUser.Response>
    getUserByEmail(email: string): Promise<getUserByEmail.Response>
    findOne(data: findOne.Request): Promise<findOne.Response>
    findOneAndUpdate(query: any, userData: any | User): Promise<findOneAndUpdate.Response>

}

export namespace createUser {
    export type Request = Omit<User, 'id'>;
    export type Response = User;
}

export namespace getUserByEmail {
    export type Response = User | null;
}

export namespace findOne {
    export type Request = User | any;
    export type Response = User | null;
}

export namespace findOneAndUpdate {
    export type Response = User | null;
}