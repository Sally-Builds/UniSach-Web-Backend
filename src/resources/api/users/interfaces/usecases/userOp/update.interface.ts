import User from "../../user.interface";


export default interface UpdateInterface {
    execute(data: Update.Request, id: string): Promise<Update.Response>
}

export namespace Update {
    export type Request = Pick<User, "first_name" | "last_name" | "phone">
    export type Response = User
}